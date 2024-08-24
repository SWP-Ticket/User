// app/requests/[eventId].tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // useParams for Next.js App Router
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { EventApi } from 'api';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';

interface Request {
  id: number;
  sponsorId: number;
  sponsorName: string;
  boothId: number;
  boothName: string;
  requestDate: string;
  status: string;
}

const EventRequestsPage: React.FC = () => {
  const { eventId } = useParams();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (eventId) {
      const fetchRequests = async () => {
        try {
          setLoading(true);
          const eventApi = new EventApi();
          const requestsData = await eventApi.apiEventRequestsGet(Number(eventId));
          //@ts-ignore
          setRequests(requestsData.data.data.listData);
        } catch (error) {
          console.error('Error fetching requests:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRequests();
    }
  }, [eventId]);

  return (
    <div>
      <Header />
      <Box>
        <Typography variant='h4' gutterBottom display={'flex'} justifyContent={'center'}>
          Event Requests
        </Typography>
      </Box>
      {loading ? (
        <Box display='flex' justifyContent='center' alignItems='center'>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sponsor Name</TableCell>
                <TableCell>Booth Name</TableCell>
                <TableCell>Request Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.sponsorName}</TableCell>
                  <TableCell>{request.boothName}</TableCell>
                  <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                  <TableCell>{request.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Footer />
    </div>
  );
};

export default EventRequestsPage;
