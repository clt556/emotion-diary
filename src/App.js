import { BrowserRouter, Route, Routes, json } from 'react-router-dom';
import './App.css';

import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";
import React, { useEffect, useReducer, useRef } from 'react';
//path가 url 매핑 경로고, 저 컴포넌트만 갈아끼워지는 형식
//그리고 SPA 방식이기 때문에, 페이지 새로고침은 안된다는 특징이 있다.
/*
  React Router Dom의 기능 3가지
  1.useParams
    Route에서 /:id 와 같이 path variable을 쓸 수 있게 하고
    해당 컴포넌트에 가서 id별 처리를 해준다

  2.useSearchParams
    Query String(query란 사용자의 요청 문구를 의미)을 작성하는 방법.
    Route에서 ?변수명=값&변수명=값 형태로 요청한 것을
    컴포넌트에서 useSearchParams로 처리한다.

  3.useNavigate
    navigate는 컴포넌트 사이드에서, 라우팅시킬 수 있는 기술이다.
*/


const reducer = (state, action) =>{
  let newState =[];
  switch(action.type){
    case `INIT`:{
      return action.data;
    }
    case `CREATE`:{
      const newItem = {
        ...action.data
      };
      newState = [newItem, ...state];
      break;
    }
    case `REMOVE`:{
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case `EDIT`:{
      newState = state.map((it) => it.id === action.data.id ? {...action.data} : it);
      break;
    }
    default:
      return state;
  }

  localStorage.setItem('diary',JSON.stringify(newState));
  /*
    같은 key값을 갖는 로컬 스토리지의 요소는, 덮어씌워짐
  */

  return newState;
}

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  /*
    localStorage 도입★
    useEffect(()=>{
    localStorage.setItem(`item1`,10);
    localStorage.setItem(`item2`,'asdz');
    localStorage.setItem(`item3`,JSON.stringify({value:21}));
    const item1 = localStorage.getItem(`item1`);
    const item2 = localStorage.getItem(`item2`);
    const item3 = JSON.parse(localStorage.getItem(`item3`));
    console.log({item1,item2,item3})
  },[]);
  */
  
  //데이터는 App.js에서 만들어서 각 컴포넌트로 뿌림
  //따라서 여기서 로컬스토리지에서 get 해서 뿌린다.
  useEffect(()=>{
    const localData = localStorage.getItem(`diary`);
    if(localData){
      const diaryList = JSON.parse(localData).sort((a,b)=>parseInt(b.id) - parseInt(a.id));

      dataId.current = parseInt(diaryList[0].id) + 1;
    
      dispatch({type:"INIT", data:diaryList});
    }
  },[])


  const [data,dispatch] = useReducer(reducer, []);

  const dataId = useRef(0);
  // CREATE
  const onCreate =  (date,content, emotion) => {
    dispatch({type: `CREATE`,data:{
      id:dataId.current,
      date: new Date(date).getTime(),
      content,
      emotion,
    }});
    dataId.current += 1;
  }
  // REMOVE
  const onRemove = (targetId) =>{
    dispatch({type:`REMOVE`, targetId});
  }
  // EDIT
  const onEdit = (targetId,date,content,emotion)=>{
    dispatch({type:`EDIT`,data:{
      id:targetId,
      date: new Date(date).getTime(),
      content,
      emotion,
    }})
  }
  

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{onCreate, onEdit, onRemove}}>
    <BrowserRouter>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/new" element={<New/>}></Route>
          <Route path="/edit/:id" element={<Edit/>}></Route>
          <Route path="/diary/:id" element={<Diary/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
    </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
