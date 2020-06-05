import { connect } from 'react-redux';
import Link from 'next/link';
import initialize from '../utils/initialize';
import Layout from '../components/Layout';

const Index = () => (
  <Layout title="Home">
    <h2 className="title is-2 mb-0">Covid Slayer</h2>
    <p>
      Slay them covid monsters!!
    </p>

    <Link href="/battle">
    	<button className="btn btn-primary btn-lg my-3">Fight Now!</button>
    </Link>

    <div>
    	<img src="/static/angry.gif" />
    </div>	
    
  </Layout>
);

Index.getInitialProps = function(ctx) {
  initialize(ctx);
};

export default connect(state => state)(Index);
