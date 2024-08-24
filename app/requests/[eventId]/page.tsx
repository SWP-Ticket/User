// app/requests/[eventId].tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  Button,
} from '@mui/material';
import { BoothRequestApi } from 'api';
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

  const updateRequestStatus = async (requestId: number, status: string) => {
    try {
      const boothRequestApi = new BoothRequestApi();
      await boothRequestApi.apiBoothRequestChangeRequestStatusIdPut(requestId, { status });
      // Update the local state to reflect the status change
      setRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === requestId ? { ...req, status } : req))
      );
    } catch (error) {
      console.error(`Error updating request status to ${status}:`, error);
    }
  };

  useEffect(() => {
    if (eventId) {
      const fetchRequests = async () => {
        try {
          setLoading(true);
          const boothRequestApi = new BoothRequestApi();
          const requestsData = await boothRequestApi.apiBoothRequestEventEventIdGet(
            Number(eventId)
          );
          console.log(requestsData);
          //@ts-ignore
          setRequests(requestsData.data.data);
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
      <Box display='flex' justifyContent='center' mb={2}>
        <Button variant='contained' onClick={() => window.history.back()}>
          Back
        </Button>
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
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.sponsorName}</TableCell>
                  <TableCell>{request.boothName}</TableCell>
                  <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    {request.status === 'Pending' && (
                      <Box display='flex' gap={2}>
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={() => updateRequestStatus(request.id, 'Approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant='contained'
                          color='secondary'
                          onClick={() => updateRequestStatus(request.id, 'Rejected')}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </TableCell>
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
