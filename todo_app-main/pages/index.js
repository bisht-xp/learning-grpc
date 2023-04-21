import { Inter } from "next/font/google";
import { useState } from "react";
import axios from "axios";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ todoList }) {
  // console.log(todoList);
  const router = useRouter();
  const [todo, setTodo] = useState(todoList.todos);
  const [newTodo, setNewTodo] = useState("");

  const handleKeyUp = async (key) => {
    if (key === "Enter" && newTodo) {
      const task = {
        title: newTodo,
      };
      try {
        await axios.post("http://localhost:8080/api/todos", task);
        router.refresh();
        setNewTodo("");
      } catch (error) {
        console.log("Something went wrong");
      }
    }
  };

  const handleDelete = async(id) => {
    try {
      await axios.delete(`http://localhost:8080/api/todos/${id}`);
      router.refresh();
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  return (
    <>
      <div className="flex justify-center pt-40">
        <div className="max-w-md w-full shadow-lg bg-white p-8 rounded-xl opacity-70">
          <div className="flex justify-center cursor-default bg-gray-200 rounded-3xl px-4 py-1 color-gray hover:scale-110 transition-all">
            <div className="w-full p-3 items-center">
              <p className="text-3xl text-gray-600 mx-auto text-center">
                FingerTip
              </p>
            </div>
          </div>

          <div className="relative mt-10">
            <div className="absolute inset-y-0 left-2 flex items-center pl-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus-circle"
                viewBox="0 0 16 16"
              >
                {" "}
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />{" "}
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            </div>
            <input
              type="text"
              id="newTodo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyUp={(e) => handleKeyUp(e.key)}
              className="block w-full pl-10 p-2 border-4 rounded-full bg-white text-gray-600"
              placeholder="new todo item"
            />
          </div>

          <ul className="block w-full pt-6">
            {todo.map((item, index) => {
              return (
                <li
                  key={item.id}
                  className="w-full border-2 rounded-xl mt-2 hover:border-blue-300"
                >
                  <input
                    id={index}
                    type="checkbox"
                    className="float-left block w-6 h-6 m-3"
                  />
                  <button
                    id={item.id}
                    onClick={() => handleDelete(item.id)}
                    className="float-right w-7 h-7 m-2.5 rounded-2xl bg-red-700 text-gray-200 shadow-md hover:bg-red-500 hover:scale-105"
                  >
                    x
                  </button>
                  <label htmlFor={index} className="block w-full p-3">
                    {item.title}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  const response = await axios.get("http://localhost:8080/api");
  const todoList = response.data;
  return {
    props: { todoList },
  };
};
