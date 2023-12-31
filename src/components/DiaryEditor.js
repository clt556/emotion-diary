import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyHeader from "./MyHeader";
import MyButton from "./MyButton";
import EmotionItem from "./EmotionItem";
import { DiaryDispatchContext } from "../App";

const getStringDate = (date) =>{
    return date.toISOString().slice(0,10);
}

const emotionList=[
    {
        emotion_id:1,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion1.png`,
        emotion_descript:"최상"
    },
    {
        emotion_id:2,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion2.png`,
        emotion_descript:"상"
    },
    {
        emotion_id:3,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion3.png`,
        emotion_descript:"중간"
    },
    {
        emotion_id:4,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion4.png`,
        emotion_descript:"하"
    },
    {
        emotion_id:5,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion5.png`,
        emotion_descript:"최하"
    },
]

const DiaryEditor = ({isEdit, originData}) =>{
    const navigate = useNavigate();
    const[date,setDate] = useState(getStringDate(new Date()));

    const[emotion, setEmotion] = useState(3);
    const handleClickEmote = useCallback((emotion)=>{
        setEmotion(emotion);
    },[]);

    const[content,setContent] = useState("");
    const contentRef = useRef();

    const {onCreate, onEdit, onRemove} = useContext(DiaryDispatchContext);
    const handleSubmit = () =>{
        if(content.length < 1){
            contentRef.current.focus();
            return;
        }
        
        

        if(window.confirm(isEdit?"일기를 수정하시겠습니까?" : "새로운 일기를 작성하시겠습니까?")){
            if(!isEdit){
                onCreate(date,content,emotion);
                navigate("/",{replace:true})
            }else{
                onEdit(originData.id, date, content, emotion);
                navigate("/",{replace:true})
            }
        }
    }

    const handleRemove = () =>{
        if(window.confirm(`정말 삭제하시겠습니까?`)){
            onRemove(originData.id);
            navigate('/',{replace:true});
        }
    }

    useEffect(()=>{
        if(isEdit){
            setDate(getStringDate(new Date(parseInt(originData.date))));
            setEmotion(originData.emotion);
            setContent(originData.content);
        }
    },[isEdit,originData])

    return(
        <div className="DiaryEditor">
            <MyHeader headText={isEdit ? `일기 수정하기` : `새 일기 쓰기`} leftChild={<MyButton text={`< 뒤로가기`} onClick={()=>navigate(-1)}/>} rightChild={
                isEdit && <MyButton text={`삭제하기`} type={`negative`} onClick={handleRemove}/>
            }
            />
            <div>
                <section>
                    <h4>오늘은 언제인가요?</h4>
                    <div className="input_box">
                        <input className="input_date"  value={date} onChange={(e)=>setDate(e.target.value)}type="date"/>
                    </div>
                </section>
            </div>
            <div>
                <section>
                    <h4>오늘의 감정</h4>
                    <div className="input_box emotion_list_wrapper">
                        {emotionList.map((it)=><EmotionItem 
                        onClick={handleClickEmote} 
                        key={it.emotion_id} 
                        {...it}
                        isSelected={it.emotion_id === emotion}/>)}
                    </div>
                </section>
            </div>
            <div>
                <section>
                    <h4>오늘의 일기</h4>
                    <div className="input_box text_wrapper">
                        <textarea ref={contentRef} value={content} onChange={(e)=>setContent(e.target.value)}
                        placeholder="오늘은 어땠나요"/>
                    </div>
                </section>
            </div>
            <div>
                <section>
                    <div className="control_box">
                        <MyButton text={`취소하기`} onClick={()=> navigate(-1)}/>
                        <MyButton text={`작성완료`} type={`positive`} onClick={handleSubmit}/>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default DiaryEditor;