import {
  Box,
  Grid,
  Paper,
  Typography,
  Checkbox,
  CircularProgress,
} from "@material-ui/core";
import { Todo as TodoType } from "../../../generated/graphql";
import { memo, useState } from "react";
import Link from "next/link";
import { useMarkTodoMutation } from "../../../generated/graphql";
import { makeStyles } from "@material-ui/styles";

interface TodoProps {
  todo: Pick<TodoType, "title" | "id" | "complete">;
}

const useStyles = makeStyles({
  link: {
    cursor: "pointer",
  },
});

/**
 * Display an individual todo in the list.
 */

export const Todo = memo(({ todo }: TodoProps) => {
  const classes = useStyles();
  const [sending, setSending] = useState(false);
  async function toggle(event) {
    setSending(true);
    try {
      await markTodo({
        variables: {
          id: todo.id,
          complete: event.target.checked,
        },
      });
      setTimeout(() => {
        setSending(false);
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  }
  const [markTodo] = useMarkTodoMutation();

  return (
    <Grid item key={todo.id}>
      <Link href={`/todo/${todo.id}`}>
        <Paper elevation={1} className={classes.link}>
          <Box p={2}>
            <Typography variant="h5">{todo.title}</Typography>
          </Box>
        </Paper>
      </Link>
      {sending ? (
        <CircularProgress />
      ) : (
        <Checkbox
          checked={todo.complete}
          onChange={toggle}
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      )}
    </Grid>
  );
});
