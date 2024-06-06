import { useEffect, useState } from 'react';
import Survey from '@/components/survey';
import { getInitialStatus } from '@/services';
import { baseUrl } from '@/constants';
import io from 'socket.io-client';

export default function Home() {
  const [options, setOptions] = useState([]);


  const getStatus = async () => {
    const options = await getInitialStatus();
    options && setOptions(options)
  }

  const addOption = async (option) => {
    setOptions(prevOptions => [...prevOptions, { team: option, votes: 0 }]);
  }

  const removeOption = async (option) => {
    setOptions(prevOptions => prevOptions.filter(o => o.team !== option))
  }

  const addVote = async (option) => {
    setOptions(prevOptions => {
      return prevOptions.map(o => {
        if (o.team === option) {
          return { ...o, votes: o.votes + 1 };
        }
        return o;
      });
    });
  }

  useEffect(() => {
    getStatus()

    const urlWithoutMethod = baseUrl.replace(/(^\w+:|^)\/\//, '');
    const socket = new WebSocket(`ws://${urlWithoutMethod}/status`);

    socket.onmessage = (event) => {
      const { team, operation } = JSON.parse(event.data);
      if (operation === 'create') {
        addOption(team);
      } else if (operation === 'delete') {
        removeOption(team);
      } else if (operation === 'vote') {
        addVote(team);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };

  }, [])
  return (
    <Survey options={options} />
  );
}
