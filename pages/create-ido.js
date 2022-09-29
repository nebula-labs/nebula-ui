import "antd/dist/antd.css";
import Page from '../components/layout/Page';
import Container from "../components/layout/Container";
import CreateIDOForm from "../components/layout/CreateIDOForm";

export default function App() {
  return (
    <Page>
        <Container
            component={<CreateIDOForm/>}
        />
    </Page>
  )
}