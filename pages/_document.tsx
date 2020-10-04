import NextDocument, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import { parse } from "cookie";
import { UserContext } from "../components/context/UserContext";

function json2str(obj: any): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

type Props = {
  loggedIn: boolean;
};

class Document extends NextDocument<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    const cookie = ctx.req?.headers.cookie ?? "";
    const cookies = parse(cookie);
    console.log(cookies);
    const initialProps = await NextDocument.getInitialProps(ctx);

    // FIXME 謎にここが2回はしっちゃって良く分からん...

    return { ...initialProps, loggedIn: true || cookies["token"] != null };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <UserContext.Provider value={{ loggedIn: this.props.loggedIn }}>
            <Main />
          </UserContext.Provider>
          <NextScript />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.__STATE__ = ${json2str({ loggedIn: this.props.loggedIn })}
              `,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default Document;
