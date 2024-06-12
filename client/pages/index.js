import { useEffect, useState } from 'react';
import Survey from '@/components/survey';
import { getInitialStatus } from '@/services';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const [options, setOptions] = useState([]);
  const [wsUrl, setWsUrl] = useState('');

  const getStatus = async () => {
    const options = await getInitialStatus();
    options?.length && setOptions(options);
  };

  const getWsUrl = async () => {
    const response = await fetch('/api/getWsUrl');
    const { wsUrl } = await response.json();
    setWsUrl(wsUrl);
  };

  const addOption = async (option) => {
    setOptions((prevOptions) => [...prevOptions, { team: option, votes: 0 }]);
  };

  const removeOption = async (option) => {
    setOptions((prevOptions) => prevOptions.filter((o) => o.team !== option));
  };

  const addVote = async (option) => {
    setOptions((prevOptions) => {
      return prevOptions.map((o) => {
        if (o.team === option) {
          return { ...o, votes: o.votes + 1 };
        }
        return o;
      });
    });
  };

  const startWebSocket = async () => {
    await getStatus();
    await getWsUrl();
  }

  useEffect(() => {
    startWebSocket();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const socket = new WebSocket(`ws://${wsUrl}/status`);

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

      // Cleanup function
      return () => {
        socket.close();
      };
    };

    fetchData();
  }, [wsUrl]);

  return (
    <div className={styles.container}>
      <Survey options={options} />
    </div>
  );
}