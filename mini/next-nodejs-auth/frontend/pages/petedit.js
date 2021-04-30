import axios from "axios";
import React, { useState, useEffect } from "react";
import styles from "../styles/student.module.css";
import withAuth from "../components/withAuth";
import Navbar from "../components/navbar";
const URL = "http://localhost/api/pet";
const admin = ({ token }) => {
  const [user, setUser] = useState({});
  const [pet, setpet] = useState({});
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [major, setMajor] = useState("");
  const [GPA, setGPA] = useState(0);
  const [pet, setpet] = useState({});
  useEffect(() => {
    getpet();
    profileUser();
  }, []);
  const profileUser = async () => {
    try {
      
      const users = await axios.get(`${config.URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
     
      setUser(users.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getpet = async (id) => {
    const result = await axios.get(`${URL}/${id}`)
    console.log('student id: ', result.data)
    setpet(result.data)
}
 
  const getpet = async () => {
    let result = await axios.get(URL);
    setpet(result.data.list);
  };

  const addStudent = async () => {
    let result = await axios.post(URL, {
      ownername,
      petsurname,
      species,
      age,
    });
    console.log(result);
    getpet();
  };

  const deletepet = async (id) => {
    let result = await axios.delete(`${URL}/${id}`);
    getpet();
  };

  const updatepet = async (id) => {
    let result = await axios.put(`${URL}/${id}`, {
      ownername,
      patsurname,
      species,
      age,
    });
    console.log(result);
    getpet();
  };

  const showpet = () => {
    if (pet && pet.length) {
      return pet.map((item, index) => {
        return (
          <div className={styles.listItem} key={index}>
            <b>Ownername:</b> {item.ownername} <br />
            <b>Patname:</b> {item.petsurname} <br />
            <b>:Species</b> {item.species} <br />
            <b>Age:</b> {item.GPA}
            <div className={styles.edit_button}>
              <button
                className={styles.button_get}
                onClick={() => getpet(item.id)}
              >
                Get
              </button>
              <button
                className={styles.button_update}
                onClick={() => updatepet(item.id)}
              >
                Update
              </button>
              <button
                className={styles.button_delete}
                onClick={() => deletepet(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      });
    } else {
      return <p>Loading...</p>;
    }
  };
  return (
    <div className={styles.container}>
      <Navbar />
      <h1><ins>Pet Data </ins></h1>
      <div className={styles.form_add}>
        <h2>Pet histoy</h2>
        OwnerName:
        <input
          type="text"
          name="ownername"
          onChange={(e) => setownerName(e.target.value)}
        ></input>
        Petsurname:
        <input
          type="text"
          name="petsurname"
          onChange={(e) => setperSurname(e.target.value)}
        ></input>
        Species:
        <input
          type="text"
          name="species"
          onChange={(e) => setspecies(e.target.value)}
        ></input>
        Age:
        <input
          type="number"
          name="age"
          onChange={(e) => setage(e.target.value)}
        ></input>
        <button
          className={styles.button_add}
          onClick={() => addpet(ownername, petsurname, species, age)}
        >
          Add
        </button>
      </div>

      <div className={styles.list}>{showpet()}</div>
      <div className={styles.list1}><b><i><ins>(selected pet)</ins></i></b> <b>  Ownername:</b>{student.ownername}<b>  Petsurname:</b>{student.petsurname} <b>  species:</b>{student.species}  <b>age:</b>{student.age}</div>
    </div>
  );
};
export default withAuth(admin);

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
