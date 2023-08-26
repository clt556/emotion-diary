import React, { useEffect, useState } from "react"
import MyButton from "./MyButton"
import { useNavigate } from "react-router-dom"
import DiaryItem from "./DiaryItem"

const ControlMenu = React.memo(({value, onChange, optionList}) => {
    return(
        <select className="ControlMenu" value={value} onChange={(e)=> onChange(e.target.value)}>
            {optionList.map((it, idx) => <option value={it.value} key={idx}>{it.name}</option>)}
        </select>
    )
})
/*
    value는 select하는 항목 (필터링 기준)
    onChange는 value에 따라 항목 바꾸기
    optionList는 옵션
*/
const sortOptionList = [
    {
        value: `latest`, name:`최신순`
    },
    {
        value: `oldest`, name:`오래된 순`
    },
]

//////////////////////////////////////////////////////////////

const filterOptionList = [
    {value:"all", name:"전부 다"},
    {value:"good", name:"좋은 감정만"},
    {value:"bad", name:"안 좋은 감정만"},
] 
//ControlMenu 컴포넌트에 optionList 속성의 값으로 넣어서 새로운 select 파트를 만듬


const DiaryList = ({diaryList}) => {
    const [sortType, setSortType] = useState(`latest`);
    const[filter,setFilter] =useState("all");

    const getProcessedDiaryList = () =>{
        const copyList = JSON.parse(JSON.stringify(diaryList));

        const compare = (a,b) =>{
            if(sortType === `latest`) {
                return parseInt(b.date) - parseInt(a.date);
            }else{
                return parseInt(a.date) - parseInt(b.date);
            }
        }

        const filterCallBack = (item)=>{
            if(filter === `good`){
                return parseInt(item.emotion) <= 3;
            }else{
                return parseInt(item.emotion) > 3;
            }
        }
        
        
        
        const filteredList = filter === `all` ? copyList : copyList.filter((it) => filterCallBack(it));
        const sortedList = filteredList.sort(compare);
        return sortedList;
    }

    const navigate = useNavigate();

    useEffect (()=> console.log(filter),[filter])

    return(
        <div className="DiaryList">
            <div className="menu_wrapper">
                <div className="left_col">
                    <ControlMenu value={sortType} onChange={setSortType} optionList={sortOptionList}/>

                    <ControlMenu
                    value={filter}
                    onChange={setFilter}
                    optionList={filterOptionList}/>
                </div>
                <div className="right_col">
                    <MyButton
                    type={`positive`}
                    text={`새 일기 쓰기`}
                    onClick={()=>navigate(`/new`)}/>
                </div>
            </div>

            {getProcessedDiaryList().map((it) => (
               
                <DiaryItem key={it.id} {...it}/>
                
                ))}
        </div>
    )
}

export default DiaryList;