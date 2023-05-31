import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import Navbar from ".././component/Navbar";
import { AiFillDelete } from "react-icons/ai";
import { BsPencilFill, BsCardList } from "react-icons/bs";
import { FiUserPlus } from "react-icons/fi";

import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [sname, setSname] = useState("");
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [btnText, setBtnText] = useState("Add Student");
  const [studentID, setStudentID] = useState("");

  const getData = async () => {
    const response = await axios.get(`http://localhost:5000/student`);
    console.log(response.data);
    setUsers(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();

    if (btnText === "Add Student") {
      const response = await axios.post(`http://localhost:5000/student`, {
        id: nanoid(),
        sname: sname,
        fname: fname,
        email: email,
        contact: contact,
      });
      setStudentID(response.data.id);

      setUsers([
        ...users,
        {
          id: response.data.id,
          sname: response.data.sname,
          fname: response.data.fname,
          email: response.data.email,
          contact: response.data.contact,
        },
      ]);

      Swal.fire(
        "Record Inserted!",
        "Record has been inserted successfully.",
        "success"
      );
      setSname("");
      setFname("");
      setEmail("");
      setContact("");
    }
    if (btnText === "Update Record") {
      console.log("Stuent id for update:", studentID);

      let updateData = {
        sname: sname,
        fname: fname,
        contact: contact,
        email: email,
      };

      const response = await axios.put(
        "http://localhost:5000/student/" + studentID,
        updateData
      );
      console.log(response.data);

      toast("Record has been updated", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: "info",
      });

      setUsers(
        users.map((user) =>
          user.id === response.data.id
            ? {
                ...user,
                sname: response.data.sname,
                fname: response.data.fname,
                contact: response.data.contact,
                email: response.data.email,
              }
            : user
        )
      );
      ClearForm();
    }
  };

  function ClearForm() {
    setSname("");
    setFname("");
    setEmail("");
    setContact("");
    setBtnText("Add Student");
  }

  async function deleteTodo(id) {
    const result = await axios.delete("http://localhost:5000/student/" + id);
    console.log(result);
    setUsers((users) => users.filter((entry) => entry.id !== id));

    toast("Record has been deleted", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      type: "error",
    });
    console.log(users);
  }

  const EditUser = async (data) => {
    setStudentID(data.id);
    setSname(data.sname);
    setFname(data.fname);
    setContact(data.contact);
    setEmail(data.email);
    setBtnText("Update Record");
  };

  return (
    <Fragment>
      <Navbar />
      <div className="container">
        <div>
          <div className="col-md-12">
            <h3 className="mt-5">Student Records using JSON Server</h3>
            <p className="mb-3">
              json-server --port=5000 --watch ./data/db.json
            </p>

            <form className="row g-3" onSubmit={addTodo}>
              <div className="col-md-6">
                <label htmlFor="inputEmail4" className="form-label">
                  Student Name
                </label>
                <input
                  type="text"
                  onChange={(e) => setSname(e.target.value)}
                  value={sname}
                  className="form-control"
                  name="sname"
                  required
                  placeholder="Enter Student Name"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="inputPassword4" className="form-label">
                  Father Name
                </label>
                <input
                  type="text"
                  onChange={(e) => setFname(e.target.value)}
                  value={fname}
                  className="form-control"
                  name="fname"
                  required
                  placeholder="Enter Father Name"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="inputAddress" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="form-control"
                  name="email"
                  required
                  placeholder="Valid Email"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="inputAddress2" className="form-label">
                  Contact
                </label>
                <input
                  type="text"
                  onChange={(e) => setContact(e.target.value)}
                  value={contact}
                  className="form-control"
                  name="contact"
                  required
                  placeholder="Mobile Number"
                />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  <FiUserPlus /> {btnText}
                </button>{" "}
                <button
                  type="reset"
                  onClick={ClearForm}
                  className="btn btn-danger"
                >
                  <BsCardList /> Clear Form
                </button>
              </div>
            </form>

            <br />
            <br />
            <h4 className="text-danger">
              {users.length > 0
                ? "Total Records : " + users.length
                : "No any records"}
            </h4>
            <div
              className="alert alert-info text-center"
              style={{ padding: "7px" }}
              role="alert"
            >
              {users.length > 0
                ? "All records are showing from json server database."
                : "No record found"}
            </div>

            <table className="table table-striped table-hover">
              <thead>
                <tr className="table-dark">
                  <th>S #</th>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Father Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((todos, ind) => {
                  return (
                    <tr key={ind}>
                      <td>{ind + 1}</td>
                      <td>{todos.id}</td>
                      <td>{todos.sname}</td>
                      <td>{todos.fname}</td>
                      <td>{todos.contact}</td>
                      <td>{todos.email}</td>
                      <td>
                        <Link to={"/"}>
                          <BsPencilFill
                            color="green"
                            title="Edit stuent"
                            onClick={() => {
                              EditUser(todos);
                            }}
                          />
                        </Link>{" "}
                        &nbsp;&nbsp;&nbsp;{" "}
                        <Link to={"/"}>
                          <AiFillDelete
                            color="#e74c3c"
                            title="Delete Student"
                            onClick={() => deleteTodo(todos.id)}
                          />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Fragment>
  );
};
export default Home;
