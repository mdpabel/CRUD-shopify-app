import { Form } from "@remix-run/react";
import { PlusCircleIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import Spinner from "./Spinner";

type PropTypes = {
  isSubmitting: boolean;
  isSubmitted: boolean;
};

const AddNewGroup = ({ isSubmitting, isSubmitted }: PropTypes) => {
  return (
    <Dialog>
      <DialogTrigger className="text-cyan-700 font-semibold flex space-x-3">
        <PlusCircleIcon /> <span>Add New Group</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">Add a new group</DialogTitle>
          <DialogDescription asChild>
            <Form className="flex flex-col space-y-4" method="post">
              <Input placeholder="Group name" name="name" />
              <Textarea placeholder="Group description" name="description" />
              <Button name="intent" value="add">
                Add new {isSubmitting ? <Spinner /> : null}
              </Button>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewGroup;
