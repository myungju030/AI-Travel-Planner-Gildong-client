import { useRef, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { theTopState } from '@/store/atom/travelAtom';
import Destinations from '@/components/travel/Destinations';
import useStatus from '@/hooks/useStatus';
import useItinerary from '@/hooks/useItinerary';
import useFetchStreamData from '@/hooks/useFetchStreamData';
import ChatRoomBox from '@/components/chat/ChatRoomBox';
import ChatBar from '@/components/chat/ChatBar';
import Loading from '@/components/common/Loading';
import Error from '@/pages/error/Error';
import styles from './styles.module.scss';

export default function ItineraryChat() {
  const { id } = useParams();
  const scrollRef = useRef<null[] | HTMLDivElement[]>([]);
  const theTop = useRecoilValue(theTopState);
  useStatus('itineraryChat', theTop.title);
  const { data, isLoading, isError } = useItinerary(id);
  const [itineraryChatList, setItineraryChatList] = useState<ChatTypes[]>([]);
  const {
    chatList,
    question,
    setQuestion,
    uploadImage,
    setUploadImage,
    isStopedScroll,
    setIsStopedScroll,
    fetchStreamData,
  } = useFetchStreamData(itineraryChatList, setItineraryChatList);

  const submitHandler = async () => {
    setUploadImage('');
    await fetchStreamData('', '', id);
  };

  const refHandler = (el: HTMLDivElement | null, number: number) => {
    scrollRef.current[number] = el;
  };

  const wheelHandler = () => {
    if (
      scrollRef.current[1] &&
      scrollRef.current[2] &&
      scrollRef.current[1]?.scrollTop + scrollRef.current[1]?.clientHeight <
        scrollRef.current[2]?.clientHeight
    ) {
      setIsStopedScroll(true);
    }
  };

  useEffect(() => {
    if (data) {
      setItineraryChatList(data);
    }
  }, [data]);

  useEffect(() => {
    if (scrollRef.current[0]) {
      if (
        scrollRef.current[1] &&
        scrollRef.current[2] &&
        scrollRef.current[1]?.scrollTop + scrollRef.current[1]?.clientHeight <=
          scrollRef.current[2]?.clientHeight
      ) {
        scrollRef.current[2]?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      } else {
        scrollRef.current[0]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    } else if (
      scrollRef.current[1] &&
      scrollRef.current[2] &&
      scrollRef.current[1]?.scrollTop + scrollRef.current[1]?.clientHeight <=
        scrollRef.current[2]?.clientHeight
    ) {
      scrollRef.current[2]?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [chatList]);

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return (
    <main>
      <Helmet>
        <title>Itinerary ChatBot</title>
      </Helmet>
      <div className={styles.destination}>
        <Destinations destinations={theTop.destinations} />
      </div>
      <div className={styles.pageWrapper}>
        <div className={styles.chatRoomContainer}>
          <div
            className={styles.chatRoom}
            ref={(el) => refHandler(el, 1)}
            onWheel={wheelHandler}
          >
            <ChatRoomBox
              chatList={chatList}
              isStopedScroll={isStopedScroll}
              refHandler={refHandler}
            />
            <ChatBar
              question={question}
              uploadImage={uploadImage}
              setQuestion={setQuestion}
              setUploadImage={setUploadImage}
              submitHandler={submitHandler}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
