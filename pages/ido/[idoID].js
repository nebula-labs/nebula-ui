import "antd/dist/antd.css";
import Page from '../../components/layout/Page';
import Container from "../../components/layout/Container";
import IDOview from "../../components/data_view/IDOview";

export default function App() {
  return (
    <Page>
        <Container
            component={<IDOview/>}
        />
    </Page>
  )
}