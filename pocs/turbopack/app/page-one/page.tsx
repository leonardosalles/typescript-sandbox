import Link from "next/link";
import SharedComponent from "../../components/SharedComponent";

const PageOne = () => {
  return (
    <div>
      <h1>Page One</h1>
      <SharedComponent />
      <p>This is the first page with some heavy content.</p>
      <Link href="/page-two">Go to Page Two</Link>
    </div>
  );
};

export default PageOne;
