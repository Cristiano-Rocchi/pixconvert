import { Col, Container, Row } from "react-bootstrap";
import DropImg from "./DropImg";
import SideBar from "./SideBar";
import "./Home2.css";
const Home2 = () => {
  return (
    <>
      <Container fluid className="pixel-convert-page">
        <Row>
          <Col
            xs={8}
            className="d-flex justify-content-center align-items-center"
          >
            <div className="dropping-zone">
              <h1 className="mb-5 text-center">Upload your image</h1>
              <DropImg />
            </div>
          </Col>
          <Col xs={4}>
            <SideBar />
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Home2;
