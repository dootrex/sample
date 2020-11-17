  import Head from "next/head";
import {Grid} from "@material-ui/core";
import {Title} from "../../common/components/Title";
import {useToDoListSubscription} from "../../generated/graphql";
import {useState} from "react";
import {TodoForm} from "./components/TodoForm";
import {Todo} from "./components/Todo";
import {Pagination} from "@material-ui/lab"

// for Pagination, I left the count at 10 as I was having trouble
//finding the length of todos
/**
 * List the todos.
 * @constructor
 */
const ToDos = () => {
  const limit = 4;
  const [offset, setOffset] = useState(0);
  const handleChange = (event, value) => {
    event.preventDefault()
    setOffset((value-1)*limit)
  };

  const {data} = useToDoListSubscription({
    variables: {
      limit,
      offset,
    }
  });

  return (
    <>
      <Head>
        <title>ToDos</title>
      </Head>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Title>ToDo</Title>
        </Grid>
        <Grid item>
          <TodoForm />
        </Grid>
        
        {data?.todo
        .map(todo => (
         <Todo todo={todo} />
        ))}
        <Pagination count={10} variant="outlined" color="primary" onChange={handleChange} />

        <Grid item>
          <hr/>
        </Grid>
      </Grid>
    </>
  )
}

export default ToDos;
