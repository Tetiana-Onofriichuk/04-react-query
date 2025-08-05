import { ClipLoader } from "react-spinners";
import css from "./loader.module.css";

type LoaderProps = {
  loading: boolean;
};
export default function Loader({ loading }: LoaderProps) {
  return (
    <div className={css.loaderWrapper}>
      {loading && <ClipLoader color="#084298" size={50} />}
    </div>
  );
}
