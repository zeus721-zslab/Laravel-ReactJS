// 파일 경로: resources/js/hooks/useMessages.js
// 읽음 처리 로직 병합 및 중복 제거 완료 버전

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash'; // ★ lodash 설치 필요: npm install lodash

// ★ authUserId 인자 추가
export function useMessages(roomId, authUserId) {
    // --- 상태 변수 선언 ---
    const [messages, setMessages] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        nextPageUrl: null,
    });
    const [loadingMore, setLoadingMore] = useState(false);
    const [allHistoryLoaded, setAllHistoryLoaded] = useState(false);

    // --- Ref 변수 선언 ---
    const chatContainerRef = useRef(null); // 채팅 스크롤 컨테이너
    const prevScrollHeightRef = useRef(null); // 추가 로딩 시 스크롤 위치 유지용
    const observerRef = useRef(null); // IntersectionObserver 인스턴스
    const observedMessageIds = useRef(new Set()); // 현재 관찰 중인 메시지 ID Set
    const visibleUnreadMessages = useRef(new Set()); // 화면에 보이고 읽음 처리 API 호출 대기중인 메시지 ID Set

    // --- 콜백 함수 정의 ---

    // 초기 메시지 로딩 함수
    const loadInitialMessages = useCallback(async (scrollToBottomFunc) => {
        if (!roomId) return;
        setHistoryLoading(true); setMessages([]); setHistoryError(null);
        setAllHistoryLoaded(false); setLoadingMore(false);
        setPagination({ currentPage: 1, lastPage: 1, nextPageUrl: null });
        console.log(`[useMessages] Fetching initial messages for roomId: ${roomId}`);

        try {
            const response = await axios.get(route('chat.messages', { roomId }));
            const { data, current_page, last_page, next_page_url } = response.data;
            console.log('[useMessages] Initial messages loaded (raw):', data);

            // ★ 중요: API가 최신 메시지를 배열 맨 앞에 두는 DESC 순서로 반환한다고 가정하고 reverse() 적용
            // 만약 API가 시간순(ASC)으로 반환한다면 data.reverse() 대신 data 사용
            setMessages(Array.isArray(data) ? data.reverse() : []);

            setPagination({ currentPage: current_page, lastPage: last_page, nextPageUrl: next_page_url });
            if (!next_page_url) setAllHistoryLoaded(true);
            if (scrollToBottomFunc) scrollToBottomFunc(false); // 초기 로드 후 즉시 스크롤
        } catch (err) {
            console.error("[useMessages] Failed to fetch initial history:", err);
            setHistoryError("Failed to load message history.");
        } finally {
            setHistoryLoading(false);
        }
    }, [roomId]); // roomId 변경 시 재생성

    // 추가 메시지 로딩 함수 (위로 스크롤 시)
    const loadMoreMessages = useCallback(async () => {
        if (!pagination.nextPageUrl || loadingMore || allHistoryLoaded) return;
        setLoadingMore(true);
        prevScrollHeightRef.current = chatContainerRef.current?.scrollHeight || null;
        try {
            console.log(`[useMessages] Fetching more messages from: ${pagination.nextPageUrl}`);
            const response = await axios.get(pagination.nextPageUrl);
            const { data, current_page, last_page, next_page_url } = response.data;
            if (data && data.length > 0) {
                console.log('[useMessages] More messages loaded:', data);
                // 이전 메시지 API가 시간순(ASC)으로 반환한다고 가정하고 reverse 후 앞에 추가
                setMessages(prevMessages => [...data.reverse(), ...prevMessages]);
                setPagination({ currentPage: current_page, lastPage: last_page, nextPageUrl: next_page_url });
                if (!next_page_url) setAllHistoryLoaded(true);
                // 스크롤 위치 유지
                requestAnimationFrame(() => {
                    if (chatContainerRef.current && prevScrollHeightRef.current !== null) {
                        const newScrollHeight = chatContainerRef.current.scrollHeight;
                        chatContainerRef.current.scrollTop += (newScrollHeight - prevScrollHeightRef.current);
                        console.log(`[useMessages] Adjusted scroll. PrevH: ${prevScrollHeightRef.current}, NewH: ${newScrollHeight}`);
                        prevScrollHeightRef.current = null; // 사용 후 초기화
                    }
                });
            } else {
                setAllHistoryLoaded(true);
            }
        } catch (err) {
            console.error("[useMessages] Failed to fetch more history:", err);
        } finally {
            setLoadingMore(false);
        }
    }, [pagination, loadingMore, allHistoryLoaded]); // 의존성 확인

    // 스크롤 이벤트 핸들러 (위로 스크롤 시 추가 로딩)
    const handleScroll = useCallback((e) => {
        const { scrollTop } = e.currentTarget;
        if (scrollTop < 50 && !loadingMore && !allHistoryLoaded && pagination.nextPageUrl) {
            console.log('[useMessages] Scrolled to top, requesting more messages...');
            loadMoreMessages();
        }
    }, [loadingMore, allHistoryLoaded, pagination.nextPageUrl, loadMoreMessages]);

    // 읽음 처리 API 호출 함수
    const markMessagesAsReadAPI = useCallback(async (messageIdsToMark) => {
        const idArray = Array.from(messageIdsToMark);
        if (idArray.length === 0) return;

        console.log(`[useMessages] Calling API to mark messages as read:`, idArray);
        try {
            visibleUnreadMessages.current.clear(); // 처리 시작 전 목록 비우기
            await axios.post(route('chat.messages.read', { roomId }), { messageIds: idArray });
            console.log('[useMessages] Successfully requested to mark messages as read:', idArray);
        } catch (error) {
            console.error('[useMessages] Failed to mark messages as read:', error);
            // 실패 시 visibleUnreadMessages를 다시 채워넣거나 재시도 로직 고려 가능
        }
    }, [roomId]); // roomId 변경 시 함수 재생성

    // Debounced API 호출 함수
    const debouncedMarkMessagesAsRead = useCallback(
        debounce(() => {
            console.log('[useMessages] Debounce triggered. Calling markMessagesAsReadAPI with:', new Set(visibleUnreadMessages.current));
            // API 호출 시 현재 Set의 복사본 전달
            markMessagesAsReadAPI(new Set(visibleUnreadMessages.current));
        }, 1000), // 1초 디바운스
        [markMessagesAsReadAPI] // 의존성 함수 변경 시 재생성
    );

    // --- Effect 훅 정의 ---

    // Intersection Observer 설정 Effect
    useEffect(() => {
        // Observer 콜백
        const handleIntersection = (entries) => {
            console.log('[useMessages] Intersection detected:', entries.filter(e => e.isIntersecting).map(e => e.target.dataset.messageId));
            let needsApiCall = false;
            entries.forEach(entry => {
                const targetElement = entry.target;
                const messageId = parseInt(targetElement.dataset.messageId, 10);
                if (isNaN(messageId)) return;

                if (entry.isIntersecting) { // 화면에 보임
                    console.log(`[useMessages] Message ${messageId} intersecting:`, entry.target);
                    if (!visibleUnreadMessages.current.has(messageId)) {
                        visibleUnreadMessages.current.add(messageId);
                        needsApiCall = true;
                    }
                    // 감지되면 즉시 관찰 중지 (API 호출은 debounce로 모아서)
                    observerRef.current?.unobserve(targetElement);
                    observedMessageIds.current.delete(messageId); // 관찰 목록에서도 제거
                }
            });

            if (needsApiCall) {
                console.log('[useMessages] Scheduling API call via debounce...');
                debouncedMarkMessagesAsRead(); // 변경사항 있을 때만 debounce 호출
            }
        };

        // Observer 인스턴스 생성
        console.log('[useMessages] Setting up IntersectionObserver.');
        observerRef.current = new IntersectionObserver(handleIntersection, {
            root: chatContainerRef.current, // 기준 요소 = 채팅 스크롤 영역
            rootMargin: '0px', // 추가 여백 없음
            threshold: 0.5 // 50% 이상 보여야 감지
        });

        // Cleanup 함수
        const currentObserver = observerRef.current;
        return () => {
            console.log('[useMessages] Cleaning up IntersectionObserver.');
            currentObserver?.disconnect();
            observedMessageIds.current.clear();
            visibleUnreadMessages.current.clear();
            debouncedMarkMessagesAsRead.cancel(); // 예약된 호출 취소
        };
    }, [chatContainerRef, debouncedMarkMessagesAsRead]); // 의존성: 스크롤 컨테이너 Ref, debounce된 함수

    // 메시지 목록 변경 시 관찰 대상 업데이트 Effect
    useEffect(() => {
        if (!observerRef.current || !chatContainerRef.current || !authUserId) return;

        const currentObserver = observerRef.current;
        console.log('[useMessages] Updating observed elements based on messages change.');

        // 현재 DOM 요소들 재확인
        const messageElements = chatContainerRef.current.querySelectorAll('[data-message-id]');
        const currentlyObserved = new Set(observedMessageIds.current); // 현재 관찰중인 ID 복사

        messageElements.forEach(el => {
            const messageId = parseInt(el.dataset.messageId, 10);
            if (isNaN(messageId)) return;

            const message = messages.find(m => m.id === messageId);

            // 조건: 메시지 존재 + 상대방 메시지 + 아직 안 읽음 + ★현재 관찰 중 아님★
            if (message && message.user?.id !== authUserId && !message.read_at && !observedMessageIds.current.has(messageId)) {
                console.log(`[useMessages] Observing message ${messageId}`, el);
                currentObserver.observe(el);
                observedMessageIds.current.add(messageId);
            }

            // 관찰 목록 업데이트 (현재 DOM에 있는 것은 제외)
            currentlyObserved.delete(messageId);
        });

        // 이전에 관찰했지만 현재 DOM에 없거나 조건 변경된 요소 unobserve
        currentlyObserved.forEach(id => {
            const el = chatContainerRef.current.querySelector(`[data-message-id="${id}"]`);
            if (el) {
                console.log(`[useMessages] Unobserving stale element ${id}`);
                currentObserver.unobserve(el);
            } else {
                // console.log(`[useMessages] Element ${id} not found in DOM for unobserve.`);
            }
            observedMessageIds.current.delete(id); // 관찰 목록에서 최종 제거
        });

    }, [messages, authUserId, chatContainerRef]); // 의존성: 메시지 목록, 사용자 ID, 스크롤 컨테이너 Ref

    // --- 최종 반환 객체 ---
    return {
        messages,
        setMessages,
        historyLoading,
        historyError,
        pagination,
        loadingMore,
        allHistoryLoaded,
        chatContainerRef,
        loadInitialMessages,
        loadMoreMessages,
        handleScroll,
    };
}
