import Head from 'next/head' 
import Layout from '../components/layout' 
import useSWR, { mutate } from "swr";
import axios from "axios";
import React, { } from "react";
import styles from "../styles/Index.module.css";
import Navbar from "../components/navbar";
const URL = "http://localhost/api/pet";
const URL_SEL = "http://localhost/api/purchase";
const fetcher = (key) => fetch(key).then((res) => res.json());
const index = () => {
  const { data, error } = useSWR(URL, fetcher, { revalidateOnFocus: false });
  if (error) return <div>failed to load</div>;
  if (!data) return <div>Loading...</div>;
  console.log("data", data);
  
  const selStu = async (id) => {
    let result = await axios.post(`${URL_SEL}/${id}`)
    mutate(URL, data);
  }

  const showpet = () => {
    if (data.list && data.list.length) {
      return data.list.map((item, index) => {
        return (
          <div className={styles.listItem} key={index}>
            <div><b>OwnerName:</b> {item.ownername}</div>
            <div><b>petSurname:</b> {item.petsurname}</div>
             <div> <b>species:</b> {item.species} </div>
            <div><b>Age:</b> {item.age}</div>
            
            <div>
            <button
              className={styles.btn}
              onClick={() => selStu(item.id)}
            >
              Select
            </button></div>
          </div>
        );
      });
    } else {
      return <p>Loading...</p>;
    }
  };
  return (
    <Layout>
       <Head>
        <title>My cat</title>
    </Head>
    <div className={styles.container}><Navbar />
      <div className={styles.title}>
      <marquee bgcolor="#A9E0B8" direction="lefe" scrollamount="5" width="100%"><ins>สวัสดียินดีต้อนรับ</ins></marquee></div>
      <div className={styles.list}>
        {showpet()}
  </div>
      
    </div>
    </Layout>
  );
};
export default index;
