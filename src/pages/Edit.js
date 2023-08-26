import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";
import DiaryEditor from "../components/DiaryEditor";

const Edit = () =>{ 
    const navigate = useNavigate();

    const{id} = useParams();
    // useParams는 현재 url에서 id라는 key로 된 동적 url 구성값의 value를 받아오는 훅임

    const diaryList = useContext(DiaryStateContext);

    const [originData, setOriginData] = useState();

    // 전체 data목록 중 id에 해당하는 요소를 가져와서 수정에 올린다
    useEffect(()=>{
        if(diaryList.length >= 1 ){
            const targetDiary = diaryList.find((it) => parseInt(it.id) === parseInt(id))

            if(targetDiary){
                setOriginData(targetDiary);
            }else{
                navigate('/home',{replace:true})
            }
        }
        
    },[id,diaryList])

    //배포용 useEffect : 사이트 이름 페이지 별로 달리 지정하기
    useEffect(()=>{
        const titleElement = document.getElementsByTagName('title')[0];
        titleElement.innerHTML = `감정 일기장 - ${id}번 일기 수정`
    },[id]);

    return(
        <div>
            {originData && <DiaryEditor isEdit={true} originData={originData}/>}
        </div>
    )
}
export default Edit;