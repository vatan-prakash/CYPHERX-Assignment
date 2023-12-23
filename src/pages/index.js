import Card from "@/components/Card";
import { useEffect, useState } from "react";

export default function Home() {
  const [userList, setUserList] = useState([])
  const [tickets, setTickets] = useState([])
  const [users, setUsers] = useState(null)
  const [status, setStatus] = useState(null)
  const [priority, setPriority] = useState(null)
  const [dropdown, setDropdown] = useState(false)
  const [group, setGroup] = useState(null)
  const [sortBy, setSortBy] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState([])

  const priorityValue = ["No Priority", "Low", "Medium", "High", "Urgent"];

  const findUserById = (id) => {
    return userList.find(item => item.id == id)
  }

  const sortByCondition = (data) => {
    if(sortBy == "title"){
      const arr = [...data]
      return arr.sort((a, b)=> a.title.localeCompare(b.title))
    }
    const arr = [...data]
    return arr.sort((a, b)=> (a.priority > b.priority))
  }

  useEffect(() => {
    if(group){
      localStorage.setItem('group', group)
    }
  }, [group])

  useEffect(() => {
    if(sortBy){
      localStorage.setItem('sortBy', sortBy)
    }
  }, [sortBy])

  useEffect(() => {
    if (group === "priority"){
      setSelectedGroup(priority)
    }
    else if (group === "status"){
      setSelectedGroup(status)
    }
    else if (group === "user"){
      setSelectedGroup(users)
    }
  }, [group, priority, status, users])

  useEffect(() => {
    fetch("https://tfyincvdrafxe7ut2ziwuhe5cm0xvsdu.lambda-url.ap-south-1.on.aws/ticketAndUsers")
      .then(res => res.json())
      .then(res => {
        const ticketArray = [...res?.tickets];
        const userArray = [...res?.users];
        setUserList(userArray)
        const obj = {}
        setTickets(ticketArray)
        const obj1 = { "Done": [], "Cancelled": [] }
        ticketArray.forEach(item => {
          if (!obj1[item.status]) {
            obj1[item.status] = []
          }
          obj1[item.status].push(item)
        })
        setStatus(obj1);
        const obj2 = {}
        ticketArray.forEach(item => {
          if (!obj2[priorityValue[item.priority]]) {
            obj2[priorityValue[item.priority]] = []
          }
          obj2[priorityValue[item.priority]].push(item)
        })
        setPriority(obj2);
        const obj3 = {}
        userArray.forEach(item => {
          obj3[item.name] = ticketArray.filter(it => it.userId === item.id)
        })
        setUsers(obj3)

        // examining localstorage
        if(localStorage.getItem('group')){
          setGroup(localStorage.getItem('group'))
        }
        if(localStorage.getItem('sortBy')){
          setSortBy(localStorage.getItem('sortBy'))
        }
      });
  }, [])

  return (
    <div>
      <div className="top">
        <div className="nav">
          <div className="display_btn" onClick={() => setDropdown(!dropdown)}>
            <div className="display_sw">
              <div className="switch-icon">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" className="icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 2h-1v5h1V2zm6.1 5H6.4L6 6.45v-1L6.4 5h3.2l.4.5v1l-.4.5zm-5 3H1.4L1 9.5v-1l.4-.5h3.2l.4.5v1l-.4.5zm3.9-8h-1v2h1V2zm-1 6h1v6h-1V8zm-4 3h-1v3h1v-3zm7.9 0h3.19l.4-.5v-.95l-.4-.5H11.4l-.4.5v.95l.4.5zm2.1-9h-1v6h1V2zm-1 10h1v2h-1v-2z"></path></svg>
              </div>
              Display
              <div className="dropdown-icon" style={dropdown ? { transform: 'rotate(180deg' } : {}}>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path></svg>
              </div>
            </div>
            {dropdown && <div className="dropdown-main" onClick={(e) => e.stopPropagation()}>
              <div className="dropdown-item grouping">
                <span style={{color:'#8D8D8D;'}}>Grouping</span>
                <select value={group} onChange={(e) => setGroup(e.target.value)}>
                  <option value="status">Status</option>
                  <option value="user">User</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
              <div className="dropdown-item ordering">
                <span style={{color:'#8D8D8D;'}}>Ordering</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>}
          </div>
        </div>
      </div>
      <div className="main col-5 col-sm-1 col-md-3">
        {selectedGroup && Object.keys(selectedGroup)?.reverse()?.map((item, i) => {
          return(
            <div key={i}>
              <div className="na-contain">
                {item}
              </div>
              <div className="tk-contain">
                {sortByCondition(selectedGroup[item]).map((it, j)=>{
                  return(
                    <div key={j}>
                      <Card data={it} findUserById={findUserById} />
                    </div>
                  )
                })}
              </div>
        </div>
          )
        })}
      </div>
    </div>
  )
}
