import {
  Modal,
  Form,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";

const Delete = (props) => {
  const onDeleteHandler = (event) => {
    event.preventDefault();
    props.userDeleter(props.id)
  };
  return (
    <Modal isOpen={props.modalDelete} toggle={props.toggleDelete} size="lg" style={{marginTop: 200}}>
      <Form onSubmit={onDeleteHandler}>
        <ModalHeader>
          <b>{props.name}</b>
        </ModalHeader>
        <ModalBody>Are you sure want to delete "{props.name}"?</ModalBody>
        <ModalFooter>
          <Button type="submit" color="primary" onClick={props.toggleDelete}>
            Yes
          </Button>{" "}
          <Button type="button" color="secondary" onClick={props.toggleDelete}>
            No
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default Delete;
