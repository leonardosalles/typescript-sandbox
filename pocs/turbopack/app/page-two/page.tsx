import Link from "next/link";
import SharedComponent from "../../components/SharedComponent";

const PageTwo = () => {
  return (
    <div>
      <h1>Page Two</h1>
      <SharedComponent />
      <p>This is the second page with additional heavy content.</p>
      <Link href="/page-one">Go to Page One</Link>
    </div>
  );
};

export default PageTwo;
