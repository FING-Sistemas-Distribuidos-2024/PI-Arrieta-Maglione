import { useEffect, useState } from 'react';
import Survey from '../components/Survey';
import { getInitialStatus } from '@/services';

export default function Home() {
  const [options, setOptions] = useState([]);

  const getStatus = async () => {
      const options = await getInitialStatus(); 
      options && setOptions(options)
  }

  useEffect(() => {
    getStatus()
  }
  ,[])
  return (
    <Survey options={options} />
  );
}
