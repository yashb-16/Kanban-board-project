import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import type { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";


interface Props{
    column: Column;
    deleteColumn: (id: Id)=>void;
    updateColumn: (id: Id, title: string) => void;
    createTask: (columnId: Id) =>void;
    deleteTask: (id: Id) =>void; 
    updateTask: (id: Id,content: string) => void;
    tasks: Task[];
}
function ColumnContainer(props: Props) {
    const { column,deleteColumn,updateColumn,createTask,tasks,deleteTask,updateTask } = props;

    const [editMode,setEditMode] = useState(false);

    const tasksIds = useMemo(() => {
        return tasks.map(task=>task.id)
    },[tasks]);
    const {setNodeRef,attributes,listeners,transform,transition,isDragging} = useSortable({
        id: column.id,
        data: {
            type:"Column",
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if(isDragging){
        return(
            <div ref={setNodeRef} style={style} className="      bg-columnBackgroundColor border-rose-500 opacity-40 border-2  w-[350px] h-[500px]  max-h-[500px] rounded-md flex flex-col"></div>
        )
    }
    return (
        <div 
            ref= {setNodeRef}
            style={style}
            className ="
        bg-columnBackgroundcolor
    w-[350px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col    
    "
        >
            {/*Column title */}
            <div 
            {...attributes}
            {...listeners}
            onClick={()=>{
                setEditMode(true);
            }}
            className ="
            bg-mainBackgroundColor
            text-md
            h-[60px]
            rounded-md
            rounded-b-none
            p-3
            font-bold
            border-columnBackgroundcolor
            border-4
            flex
            items-center
            justify-between
            "
            >
                <div className="flex gap-2" >
                    
                    
                    {!editMode && column.title}
                    {editMode && (
                        <input
                            className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                            value={column.title}
                            onChange={(e) => updateColumn(column.id,e.target.value)}
                            autoFocus
                            onBlur={() => {
                                setEditMode(false);
                            }}
                            onKeyDown={(e)=>{
                                if(e.key !== "Enter") return;
                                setEditMode(false);
                            }}
                        />
                    )}
                </div>
                <button 
                onMouseDown={(e)=> { e.stopPropagation(); }}
                onTouchStart={(e)=> { e.stopPropagation(); }}
                onPointerDown={(e)=> { e.stopPropagation(); }}
                onClick={()=> {
                    deleteColumn(column.id);
                }}
                className="
                text-gray-500
                hover:text-white
                hover:bg-columnBackgroundcolor
                rounded
                px-1
                py-2
                "
                >
                    <TrashIcon />
                </button>
            </div>
                
            {/*Coumn task container */}
            <div className = "flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                <SortableContext items={tasksIds}>{
                tasks.map((task)=> (
                    <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
                ))
            } </SortableContext>
            </div>
            {/* Column footer */}
            <button className="flex gap-2 items-center border-columnBackgroundcolor border-2 rounded-md p-4 
            border-x-columnBackgroundcolor
            hover:bg-mainBackgroundColor hover:text-rose-500
            active:bg-black" 
            onClick={()=> {
                createTask(column.id);
            }}>
                <PlusIcon />
                Add task
            </button>
            <div></div>
        </div>
    );
}

export default ColumnContainer