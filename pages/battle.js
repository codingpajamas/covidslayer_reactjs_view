import React from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import initialize from '../utils/initialize';
import Layout from '../components/Layout';
import axios from 'axios';
import { API } from '../config';
import FormData from 'form-data';

class Battle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      monsterHP: 100,
      userHP: 100,
      winner: ''
    };
  }

  static async getInitialProps(ctx) {
    initialize(ctx); 
    const token = ctx.store.getState().authentication.token;
    
    if (token) {
      const profileRes = await axios.get(`${API}/users/me?_token=${token}`);
      const user = profileRes.data.user.fullname; 

      const battleRes = await axios.post(`${API}/battles/start?_token=${token}`);
      const battleId = battleRes.data.battle.id;
      const monsterName = battleRes.data.monster.name;
      const monsterImg = battleRes.data.monster.image;
      const battleLog = battleRes.data.log.details;

      return {
        token,
        user,
        battleId,
        monsterName,
        monsterImg,
        battleLog
      };
    }
  }

  componentDidMount() {
    console.log('Battle mounted')
    
    this.setState(state => ({
      logs: [this.props.battleLog, ...state.logs]
    }));
  } 

  activity(type) {  
    // halt if someone won
    if(this.state.winner) {
      return false;
    }

    axios.defaults.headers.post['Accept'] = 'application/json';
    let typeUrl = 'battles/activity/'+this.props.battleId;  
    let form = new FormData(); 
    form.append('type', type);

    axios.post(`${API}/${typeUrl}?_token=${this.props.token}`, form)
      .then((response) => {
        console.log(response)
        if(response.data.userAtk){
          this.setState(state => ({
            logs: [response.data.userAtk.details, ...state.logs],
            monsterHP: response.data.userAtk.playerLog.Log.monster_hp,
            userHP: response.data.userAtk.playerLog.Log.user_hp
          }));  
        }

        if(response.data.monsterAtk && this.state.userHP > 0){
          this.setState(state => ({
            logs: [response.data.monsterAtk.details, ...state.logs],
            monsterHP: response.data.monsterAtk.monsterLog.Log.monster_hp,
            userHP: response.data.monsterAtk.monsterLog.Log.user_hp
          }));
        }

        // just check if someone won
        // this can be done in the backend
        if(this.state.monsterHP < 1) {
          this.setState(state => ({
            winner: 'player',
          })); 
        }

        // check for possible draw, then player win (have mercy)
        if(this.state.userHP < 1 && !this.state.winner) {
          this.setState(state => ({
            winner: 'covid',
          })); 
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  render() {
    return (
      <Layout title="Battle">
        {(this.props.user && (
          <div className="title is-3">
            <h5>{this.props.battleLog}</h5> 

            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-md-9 py-5">
                  <div className="row">
                    <div className="col-sm-5">
                      <img src="/static/ninja.png" /> 
                      {this.state.winner == 'player' 
                        ? <div>Winner! <img src="/static/medal.png"/> </div>
                        : <div><div className="progress mt-3">
                            <div className="progress-bar" 
                              role="progressbar" 
                              style={{width: this.state.userHP+'%'}} 
                              aria-valuenow={this.state.userHP} 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            >{this.state.userHP}%</div>
                          </div>

                          <h4>{this.props.user}</h4>
                          </div>
                      } 
                    </div>
                    <div className="col-sm-2 py-5">
                      <img src="/static/fight.png" className="align-middle"/>
                    </div>
                    <div className="col-sm-5 text-center">
                      <img src={'/static/virus/'+this.props.monsterImg} /> 
                      
                      {this.state.winner == 'covid' 
                        ? <div>Winner <img src="/static/medal.png"/> </div>
                        : <div><div className="progress mt-3">
                            <div className="progress-bar" role="progressbar" 
                              style={{width: this.state.monsterHP+'%'}} 
                              aria-valuenow={this.state.monsterHP} 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            >{this.state.monsterHP}%</div>
                          </div>
                          <h4>{this.props.monsterName}</h4>
                          </div>
                      }
                      
                    </div> 
                  </div>

                  <div className="row">
                    <div className="col-sm-6 col-md-3 mt-3">
                      <button className="btn-block btn btn-primary"
                        onClick={() => this.activity("attack")}
                      >Attack</button> 
                    </div>
                    <div className="col-sm-6 col-md-3 mt-3"> 
                      <button className="btn-block btn btn-primary"
                        onClick={() => this.activity("power_attack")}
                      >Blast</button> 
                    </div>
                    <div className="col-sm-6 col-md-3 mt-3"> 
                      <button className="btn-block btn btn-success"
                        onClick={() => this.activity("heal")}
                      >Heal</button> 
                    </div>
                    <div className="col-sm-6 col-md-3 mt-3"> 
                      <button className="btn-block btn btn-warning"
                        onClick={() => this.activity("give_up")}
                      >Give Up</button>
                    </div>
                  </div> 
                </div>
                <div className="col-md-3 py-5">
                  <div style={{maxHeight: 270, overflowY: 'auto'}}>
                    <ul className="list-group text-left">
                      {this.state.logs.map(log => (
                        <li className="list-group-item" style={{fontSize: 12}}>
                          {log}
                        </li>
                      ))}
                      
                    </ul>
                  </div>
                </div>
                
                
              </div>
            </div> 
            
          </div>
        )) || (
          <h3 className="title is-3 has-text-danger ">Please Login.</h3>
        )}
      </Layout>
    );
  }
}

export default connect(
  state => state,
  actions
)(Battle);
