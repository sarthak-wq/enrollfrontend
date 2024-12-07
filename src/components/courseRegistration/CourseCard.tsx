import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Snackbar,
  Box,
  Modal,
  Fade,
  Backdrop,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CourseOffer } from '../../models/CourseModel';
import { registerForCourse, deleteCourse, updateCourse } from '../../services/course-service';
import { User } from '../../models/UserModel';
import { getUserById } from '../../services/admin-service';
import { setBadge } from '../../services/badge-service';

// interface for coursecardprops
interface CourseCardProps {
  course: CourseOffer;
  onCourseUpdated: () => void; // Callback to update parent component with new course details
  onCourseDeleted: () => void;
}
// styling the components
const StyledCard = styled(Card)({
  height: '100%',
  background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
  borderRadius: '15px',
  padding: '1.5rem',
  transition: 'all 0.3s ease-in-out',
  border: '1px solid rgba(147, 112, 219, 0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(255, 105, 180, 0.2)',
  }
});

const RegisterButton = styled(Button)({
  background: 'linear-gradient(45deg, #FF69B4 30%, #9370DB 90%)',
  color: 'white',
  borderRadius: '25px',
  padding: '8px 24px',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 180, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF1493 30%, #8A2BE2 90%)',
  },
  '&.registered': {
    background: 'linear-gradient(45deg, #4CAF50 30%, #45a247 90%)',
  }
});

const AllButton = styled(Button)({
  color: '#9370DB',
  '&:hover': {
    color: '#FF69B4',
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
  }
});

const CourseTitle = styled(Typography)({
  color: '#333',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  background: 'linear-gradient(45deg, #FF69B4, #9370DB)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

const CourseInfo = styled(Typography)({
  color: '#666',
  marginBottom: '0.5rem',
  fontSize: '0.95rem',
  '& strong': {
    color: '#9370DB'
  }
});

const ModalContent = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  padding: '2rem',
  outline: 'none',
});

// the course card that will be displayed
const CourseCard: React.FC<CourseCardProps> = ({ course, onCourseUpdated, onCourseDeleted }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [registeredCoursesCount, setRegisteredCoursesCount] = useState<number>(0);

  // getting user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUserById();
        setUser(fetchedUser);

        // Check if the course is in the user's enrolled courses
        const isEnrolled = fetchedUser.enrolledCourses.some(
          enrolledCourse => enrolledCourse.courseOffer.courseOfferId === course.courseOfferId
        );
        setIsRegistered(isEnrolled);
        const count = fetchedUser.enrolledCourses.length;
        setRegisteredCoursesCount(count);

        // Fugu functionality to set badge for number of courses registered
        setBadge(count)
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user data. Please try again later.');
      }
    };
    fetchUser();
  }, [course.courseOfferId]);


  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false); // For course details modal


  // Modal fields state for updating course
  const [courseName, setCourseName] = useState<string>(course.course.name);
  const [courseCode, setCourseCode] = useState<string>(course.course.courseCode);
  const [courseDescription, setCourseDescription] = useState<string>(course.course.courseDescription || '');

  // register for course
  // function to handle the register functionality
  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await registerForCourse(course);
      setIsRegistered(true);
      setSnackbarMessage('Successfully registered for the course!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error registering for course:', error);
      setSnackbarMessage('Failed to register for the course. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setIsRegistering(false);
    }
  };

  // handling open and close modal for learn more 
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);


  const handleOpenDetailsModal = () => setDetailsModalOpen(true);
  const handleCloseDetailsModal = () => setDetailsModalOpen(false);

  const handleDelete = async () => {
    try {
      await deleteCourse(course);
      setSnackbarMessage('Course deleted successfully!');
      setSnackbarOpen(true);
      onCourseDeleted(); // Notify parent component to refresh course list
    } catch (error) {
      console.error('Error deleting course:', error);
      setSnackbarMessage('Failed to delete the course. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedCourse: CourseOffer = {
        ...course,
        course: {
          ...course.course,
          name: courseName,
          courseCode: courseCode,
          courseDescription: courseDescription,
        }
      };

      await updateCourse(updatedCourse);
      setSnackbarMessage('Course updated successfully!');
      setSnackbarOpen(true);
      setModalOpen(false); // Close the modal after updating
      onCourseUpdated(); // Notify parent to refresh course list with updated details
    } catch (error) {
      console.error('Error updating course:', error);
      setSnackbarMessage('Failed to update the course. Please try again.');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <StyledCard>
        <CourseTitle>{course.course.name}</CourseTitle>
        <CourseInfo>Course Code: {course.course.courseCode}</CourseInfo>
        <CourseInfo>Instructor: {course.faculty}</CourseInfo>
        <CourseInfo>Term: {course.term.semester} {course.term.year}</CourseInfo>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          {user?.role === 'Student' && (
            <RegisterButton
              onClick={handleRegister}
              disabled={isRegistered || isRegistering}
              className={isRegistered ? 'registered' : ''}
            >
              {isRegistering ? "Registering..." : isRegistered ? "Registered" : "Register"}
            </RegisterButton>
          )}
          <AllButton onClick={handleOpenDetailsModal}>Learn More</AllButton>
          {user?.role === 'Admin' && (
            <Box>
              <AllButton onClick={handleDelete}>Delete</AllButton>
              <AllButton onClick={handleOpenModal}>Update</AllButton>
            </Box>
          )}
        </Box>
      </StyledCard>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <ModalContent>
            <CourseTitle>Update {course.course.name}</CourseTitle>
            <TextField
              label="Course Name"
              fullWidth
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Course Code"
              fullWidth
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              margin="normal"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="contained" color="primary" onClick={handleUpdate}>Save Changes</Button>
            </Box>
          </ModalContent>
        </Fade>
      </Modal>
      <Modal
        open={detailsModalOpen}
        onClose={handleCloseDetailsModal}
        closeAfterTransition
      >
        <Fade in={detailsModalOpen}>
          <ModalContent>
            <CourseTitle>Course Details</CourseTitle>
            <CourseInfo><strong>Course Name:</strong> {course.course.name}</CourseInfo>
            <CourseInfo><strong>Course Code:</strong> {course.course.courseCode}</CourseInfo>
            <CourseInfo><strong>Instructor:</strong> {course.faculty}</CourseInfo>
            <CourseInfo><strong>Term:</strong> {course.term.semester} {course.term.year}</CourseInfo>
            <CourseInfo><strong>Description:</strong> {course.course.courseDescription}</CourseInfo>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              <Button variant="outlined" onClick={handleCloseDetailsModal}>Close</Button>
            </Box>
          </ModalContent>
        </Fade>
      </Modal>


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default CourseCard;
