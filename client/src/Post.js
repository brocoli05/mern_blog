import { Link } from "react-router-dom";
// import { format, formatISO9075 } from "date-fns"; // npm install date-fns

export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
}) {
  return (
    // <div className="post">
    //   <div className="image">
    //     <img src="https://techcrunch.com/wp-content/uploads/2016/08/gettyimages-82180713.jpg?w=990&crop=1" />
    //   </div>
    //   <div className="texts">
    //     <h2>
    //       The SEC’s broadening of investment adviser obligations comes with
    //       hidden costs
    //     </h2>
    //     <p className="info">
    //       <span className="author">David McDonald</span>
    //       <time>2023-01-06 16:45</time>
    //     </p>
    //     <p className="summary">
    //       utting-edge technology, from machine learning and AI to new payment
    //       rails, is transforming the world of financial services, including how
    //       fintech startups manage investor assets, assess the suitability of
    //       investments, and execute transactions.
    //     </p>
    //   </div>
    // </div>
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={"http://localhost:4000/" + cover} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <p className="author">{author}</p>
          <time>{createdAt}</time>
          {/* <time>{format(new Date(createdAt), "MMM d, yyyy HH:mm")}</time> */}
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
