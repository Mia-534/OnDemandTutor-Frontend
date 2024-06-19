import React, { useEffect, useRef, useState } from "react";
import { Card, Tabs, Button, Rate, Skeleton, Row, Col, List } from "antd";
import { useDocumentTitle } from "../../hooks";
import { getTutorById, getTutorReviews, getTutorEducation } from "../../utils/tutorAPI";
import { Tutor } from "../../components/TutorsList/Tutor.type";
import Container from "../../components/Container";
import Title from "antd/es/typography/Title";
import * as Styled from './TutorDetail.styled';
import { Schedule as ScheduleData, ScheduleEvent } from '../../components/Schedule/Schedule.type';

import iconEducation from "../../assets/images/image12.png";
import iconPerson from "../../assets/images/image14.png";
import iconBachelor from "../../assets/images/image13.png";
import Schedule from "../../components/Schedule/Schedule";
import BookTutor from "../../components/Popup/BookTutor";

const { TabPane } = Tabs;

interface Reviews {
  content?: string;
  createdBy?: string;
  createdAt?: string;
  avatarUrl?: string;
  rating?: number;
  loading: boolean;
}

interface Education {
  id?: number;
  majorName?: string;
  specialization?: string;
  universityName?: string;
  degreeType?: string;
  startYear?: number;
  endYear?: number;
}

interface Certification {
  nameCertificate?: string;
  startYear?: number;
  subject?: string;
}

const TutorDetail: React.FC = () => {
  useDocumentTitle("Tutor Detail | MyTutor");

  const [selectedId, setSelectedId] = useState<number[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleEvent[]>([]);

  const aboutRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (key: string) => {
    let ref;
    switch (key) {
      case "1":
        ref = aboutRef;
        break;
      case "2":
        ref = scheduleRef;
        break;
      case "3":
        ref = reviewRef;
        break;
      case "4":
        ref = resumeRef;
        break;
      default:
        ref = aboutRef;
    }
    ref?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getEmbedUrl = (url: string): string => {
    const videoIdMatch = url.match(/v=([^&]+)/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
  };

  const tutorId: number = parseInt(window.location.pathname.split('/')[2]);

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [educations, setEducations] = useState<Education | null>(null);
  const [certification, setCertification] = useState<Certification[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        //Fetch Tutor Data
        const tutorResponse = await getTutorById(tutorId);
        setTutor(tutorResponse.data);

        // Fetch Reviews Data
        const reviewsResponse = await getTutorReviews(tutorId, page, 1);
        setReviews(reviewsResponse.data.content);

        //Fetch Education Data
        const educationResponse = await getTutorEducation(tutorId);
        const educationArray: Education[] = educationResponse.data;
        if (educationArray.length > 0) {
          setEducations(educationArray[0]);
        }
        // console.log(educationResponse.data);
        // setEducations(educationResponse.data)

      } catch (err) {
        setError("Failed to fetch tutor details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tutorId]);

  const onLoadMore = async () => {
    setLoading(true);
    try {
      const newPage = page + 1;
      const newReviewsResponse = await getTutorReviews(tutorId, newPage, 1);
      setReviews((prevReviews) => [...prevReviews, ...newReviewsResponse.data.content]);
      setPage(newPage);
    } catch (err) {
      setError("Failed to load more reviews");
    } finally {
      setLoading(false);
    }
  };

  if (loading && page === 0) {
    return <Skeleton active />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const loadMore = !loading ? (
    <Row>
      <Col lg={24} md={24} xs={24} sm={24} >
        <Styled.ButtonWrapper>
          <Styled.SeeMoreButton onClick={onLoadMore}>More Reviews</Styled.SeeMoreButton>

        </Styled.ButtonWrapper>
      </Col>
    </Row>
  ) : null;

  return (
    <Styled.TutorDetailBackground>
      <Container>
        {tutor && (
          <Row justify='space-between'>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Styled.TutorInfoCard>
                <Col>
                  <Styled.TutorImage src={tutor.avatarUrl || '/default-avatar.png'} alt={tutor.fullName} />
                </Col>
                <Col>
                  <Styled.TutorDetails>
                    <Styled.BestTutorName level={2}>{tutor.fullName}</Styled.BestTutorName>
                    <Styled.BestTutorEducation>
                      <Styled.BestTutorEducationBachelorImage src={iconEducation} alt="education" />
                      {educations && (
                        <Styled.BestTutorEducationBachelor>{educations.majorName}</Styled.BestTutorEducationBachelor>
                      )}
                    </Styled.BestTutorEducation>
                    <Styled.BestTutorEducation>
                      <Styled.BestTutorEducationBachelorImage src={iconBachelor} alt="bachelor" />
                      {educations && (
                        <Styled.BestTutorEducationBachelor>{educations.degreeType}</Styled.BestTutorEducationBachelor>
                      )}
                    </Styled.BestTutorEducation>
                    <Styled.BestTutorStudent>
                      <Styled.BestTutorStudentImage src={iconPerson} alt="person" />
                      <Styled.BestTutorEducationBachelor>55 students taught</Styled.BestTutorEducationBachelor>
                    </Styled.BestTutorStudent>
                    <Styled.BestTutorDescription>{tutor.backgroundDescription}</Styled.BestTutorDescription>
                  </Styled.TutorDetails>
                </Col>
              </Styled.TutorInfoCard>
              <div>
                <Styled.StyledTabs defaultActiveKey="1" onTabClick={handleTabClick}>
                  <TabPane tab="About" key="1" />
                  <TabPane tab="Schedule" key="2" />
                  <TabPane tab="Review" key="3" />
                  <TabPane tab="Resume" key="4" />
                </Styled.StyledTabs>
                <Styled.SectionInfor ref={aboutRef}>
                  <Styled.TitleWrapper>
                    <Styled.TitleDetail level={4}>ABOUT THE TUTOR</Styled.TitleDetail>
                  </Styled.TitleWrapper>
                  <p>{tutor.backgroundDescription}</p>
                </Styled.SectionInfor>
                <Styled.SectionInfor ref={scheduleRef}>
                  <Styled.TitleWrapper>
                    <Styled.TitleDetail level={4}>SCHEDULE</Styled.TitleDetail>
                  </Styled.TitleWrapper>
                  <Schedule tutorId={tutorId} setSelectedId={setSelectedId} setSelectedSchedule={setSelectedSchedule} selectedId={selectedId} selectedSchedule={selectedSchedule} />

                </Styled.SectionInfor>
                <Styled.SectionInfor ref={reviewRef}>
                  <Styled.TitleWrapper>
                    <Styled.TitleDetail level={4}>REVIEWS</Styled.TitleDetail>
                  </Styled.TitleWrapper>
                  <List
                    className="demo-loadmore-list"
                    loading={loading}
                    itemLayout="horizontal"
                    loadMore={loadMore}
                    dataSource={reviews}
                    renderItem={(item) => (
                      <List.Item>
                        <Skeleton avatar title={false} loading={item.loading} active>
                          <Styled.ReviewCard>
                            <Styled.ReviewHeader>
                              <Styled.AvatarStyled src={item.avatarUrl} />
                              <div>
                                <Styled.StudentName>{item.createdBy}</Styled.StudentName>
                                <Styled.DateRated>{item.createdAt}</Styled.DateRated>
                                <Styled.Rating disabled defaultValue={item.rating} />
                              </div>
                            </Styled.ReviewHeader>
                            <Styled.ReviewContent>{item.content}</Styled.ReviewContent>
                          </Styled.ReviewCard>
                        </Skeleton>
                      </List.Item>
                    )}
                  />
                </Styled.SectionInfor>
                <Styled.ResumeSection ref={resumeRef}>
                  <Styled.TitleWrapper>
                    <Styled.TitleDetail level={4}>RESUME</Styled.TitleDetail>
                  </Styled.TitleWrapper>
                  {educations && (
                    <Styled.Section>
                      <Col lg={4} md={4} sm={4} xs={4}>
                        <Styled.SectionHeader>Education</Styled.SectionHeader>
                      </Col>
                      <Col lg={20} md={20} sm={20} xs={20}>
                        <Styled.SectionContent>
                          <Styled.Item>
                            <Styled.Year>{educations.startYear} - {educations.endYear}</Styled.Year>
                            <Styled.Description>
                              {educations.universityName}<br />
                              {educations.degreeType}
                            </Styled.Description>
                          </Styled.Item>
                        </Styled.SectionContent>
                      </Col>
                    </Styled.Section>
                  )}

                  {educations && (
                    <Styled.Section>
                      <Col lg={4} md={4} sm={4} xs={4}>
                        <Styled.SectionHeader>Certification</Styled.SectionHeader>
                      </Col>
                      <Col lg={20} md={20} sm={20} xs={20}>
                        <Styled.SectionContent>
                          <Styled.Item>
                            <Styled.Year>{educations.startYear} - {educations.endYear}</Styled.Year>
                            <Styled.Description>
                              {educations.specialization}<br />
                              {educations.degreeType}
                            </Styled.Description>
                          </Styled.Item>
                        </Styled.SectionContent>
                      </Col>
                    </Styled.Section>
                  )}

                </Styled.ResumeSection>
              </div>
            </Col>
            <Col lg={9} md={9} sm={9} xs={24}>
              <Styled.TutorVideoCard>
                <Styled.TutorVideo>
                  {tutor.videoIntroductionLink && (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ borderRadius: '12px' }}
                      src={getEmbedUrl(tutor.videoIntroductionLink)}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </Styled.TutorVideo>
                <Styled.BookingInformation>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex' }}>
                      <Styled.IconStyleStart />
                      <Styled.BookingRatingAndPrice>{tutor.averageRating}</Styled.BookingRatingAndPrice>
                    </div>
                  </div>
                  <div>
                    <Styled.BookingRatingAndPrice>{tutor.teachingPricePerHour?.toLocaleString() + 'đ'}</Styled.BookingRatingAndPrice>
                  </div>
                </Styled.BookingInformation>
                {/* <Styled.BookingTutorButton> */}
                <BookTutor tutorId={tutorId} />
                {/* </Styled.BookingTutorButton> */}
                <Styled.SendMessageButton>Send message</Styled.SendMessageButton>
                <Styled.SendMessageButton>Save to my list</Styled.SendMessageButton>
              </Styled.TutorVideoCard>
            </Col>
          </Row>
        )}
      </Container>
    </Styled.TutorDetailBackground>
  );
};

export default TutorDetail;