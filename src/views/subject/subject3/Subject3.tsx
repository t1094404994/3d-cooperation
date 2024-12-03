import { main } from "./main";

interface Subject1Props {
  gl: WebGL2RenderingContext | null | undefined;
}
export default function Subject1(props: Subject1Props) {
  if (props.gl) {
    main(props.gl);
  }
  return (
    <div>
      <h2>Subject3</h2>
    </div>
  );
}
