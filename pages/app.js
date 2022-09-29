import "antd/dist/antd.css";
import Page from '../components/layout/Page';
import Container from "../components/layout/Container";
import Dashboard from "../components/layout/Dashboard";

export default function App() {
  return (
    <Page>
        <Container
            component={<Dashboard/>}
        />
    </Page>
  )
}