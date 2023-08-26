import { useContext, useEffect, useState } from "react";

import MyHeader from "../components/MyHeader";
import MyButton from "../components/MyButton";
import { DiaryStateContext } from "../App";
import DiaryList from "../components/DiaryList";
const Home = () =>{
    const[curDate, setCurDate] = useState(new Date());

    const headText = `${curDate.getFullYear()}년 ${curDate.getMonth()+1}월`;

    const increaseMonth = () => {
        setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() +1, curDate.getDate()));
    }
    const decreaseMonth = () => {
        setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() -1, curDate.getDate()));
    }

    const diaryList = useContext(DiaryStateContext);
    
    const [data,setData] = useState([]);
    
    useEffect(()=>{
        const firstDay = new Date(
            curDate.getFullYear(),
            curDate.getMonth(),
            1
            ).getTime(); //1일은 그 해/월의 첫날

        const lastDay = new Date(
            curDate.getFullYear(),
            curDate.getMonth() + 1,
            0,
            23,
            59,
            59,
        ).getTime(); //0일은 그 해/월의 전 월의 마지막날

        setData(diaryList.filter((it)=> firstDay <= it.date && it.date <= lastDay));

    },[diaryList,curDate])

    //배포용 useEffect : 사이트 이름 페이지 별로 달리 지정하기
    useEffect(()=>{
        const titleElement = document.getElementsByTagName('title')[0];
        titleElement.innerHTML = `감정 일기장`
    },[]);


    return(
        
        <div>
           <MyHeader headText={headText}
           leftChild={<MyButton text={`<`} onClick={decreaseMonth}/>}  rightChild={<MyButton text={`>`} onClick={increaseMonth}/>} />
           <DiaryList diaryList={data}/>
            
        </div>
    )
}

export default Home;