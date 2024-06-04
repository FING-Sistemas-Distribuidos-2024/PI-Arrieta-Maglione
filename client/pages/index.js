import { useEffect } from 'react';
import Survey from '../components/Survey';

export default function Home() {
  useEffect(
    () => getStatus()
  ,[])
  return (
    <Survey />
  );
}

const getStatus = () => {
  fetch('/api/status', {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json'
    }
  }).then(async (res) => {
      if (res.status != 200) alert("Error: " + res.status)
  }).catch((err) => { 
      alert('Error:' + err);
  });
}