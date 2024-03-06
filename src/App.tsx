import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import './App.css';

interface Todo {
  body: string;
  id: number;
  title: string;
  userId: number;
}

function App() {
  const queryclient = useQueryClient();
  const url = 'https://jsonplaceholder.typicode.com/';
  const { data, error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const response = await fetch(`${url}/posts/`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    // staleTime: 3000,
    // refetchInterval:3000
    gcTime: 10 * (60 * 1000),
  });

  // const id = data.id

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ['posts'],
  //   queryFn: async () => {
  //     try {
  //       const response = await fetch(`${url}/posts/`);
  //       const data = await response.json();
  //       return data;
  //     } catch (error) {
  //       console.log(error);
  //       return error;
  //     }
  //   },
  //   // staleTime: 3000,
  //   // refetchInterval:3000
  //   gcTime: 10 * (60 * 1000),
  //   // enabled: !!id
  // });

  const { mutate } = useMutation({
    mutationFn: async (newPost: Todo) => {
      try {
        const response = await fetch(`${url}posts`, {
          method: 'POST',
          body: JSON.stringify(newPost),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        const res = await response.json();
        return res;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    onSuccess: (newPost: Todo) => {
      queryclient.setQueryData(['posts'], (oldPost: Todo[]) => {
        return [...oldPost, newPost];
      });
    },
  });

  if (error) return <div className="">There was an Error</div>;

  if (isLoading) return <div className="">Is Loading</div>;
  console.log(data);
  return (
    <>
      <button
        onClick={() =>
          mutate({
            userId: 50000,
            id: 4000,
            title: 'hey my name is Carlos',
            body: 'this is the body of this post',
          })
        }
      >
        Add Post
      </button>
      {data.map((todo: Todo) => (
        <h2 key={todo.id}>{`${todo.id} ${todo.title}`}</h2>
      ))}
    </>
  );
}

export default App;
