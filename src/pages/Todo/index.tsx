import { memo, useState, useCallback } from "react";
import { Title } from "../../common/components/Title";
import {
  useCreateCommentMutation,
  useMarkTodoMutation,
  useSingleToDoQuery,
  useTodoCommentsSubscription,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import {
  Checkbox,
  Grid,
  Typography,
  TextField,
  CircularProgress,
  Paper,
  Box,
  List,
  ListItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

/**
 * Display and interact with a single Todo.
 */
const useStyles = makeStyles({
  link: {
    cursor: "pointer",
  },
});
const Todo = memo(() => {
  const {
    query: { id },
  } = useRouter();
  const [comment, setComment] = useState("");
  const [commId, setCommId] = useState(uuidv4());
  const [sending, setSending] = useState(false);
  const classes = useStyles();

  const { data: todoResponse, refetch } = useSingleToDoQuery({
    variables: { id },
  });
  const todo = todoResponse?.todo_by_pk;

  const { data: commentsResponse } = useTodoCommentsSubscription({
    variables: { todoId: id },
  });
  const comments = commentsResponse?.comments;

  //toggle is used to toggle between completed and inprocess todos
  //this status can also be used to toggle between css classes and have animated background fades
  async function toggle(event) {
    setSending(true);
    try {
      await markTodo({
        variables: {
          id: id,
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
  const [createComment, { loading }] = useCreateCommentMutation({
    variables: {
      comment: {
        id: commId,
        todo_id: id,
        comment: comment,
      },
    },
  });

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await createComment();
        setComment("");
        setCommId(uuidv4());
      } catch (error) {
        console.log(error);
      }
    },
    [createComment]
  );
  if (loading) {
    return <CircularProgress />;
  }
  return (
    <>
      <Head>
        <title>A ToDo</title>
      </Head>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Link href="/">
            <Title className={classes.link}>Back</Title>
          </Link>
        </Grid>
        <Grid item>
          <Paper elevation={1}>
            {todo && (
              <Box p={1}>
                <Typography variant="h5">{todo.title}</Typography>
                {sending ? (
                  <CircularProgress />
                ) : (
                  <Checkbox
                    checked={todo.complete}
                    onChange={toggle}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                )}
              </Box>
            )}
          </Paper>
          <Grid item>
            {comments &&
              comments.map((comm) => (
                <List>
                  <ListItem divider={true}>{comm.comment}</ListItem>
                </List>
              ))}
          </Grid>
        </Grid>
        <Grid item>
          <form onSubmit={onSubmit}>
            <TextField
              label="Leave a Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </form>
        </Grid>
      </Grid>
    </>
  );
});

export default Todo;
