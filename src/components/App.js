import React, {Component} from "react";
import './App.css'
import Navbar from './Navbar'; 
import Web3 from "web3";
import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'
import Main from './Main.js'
import Particles from "react-tsparticles";

class App extends Component{

    async UNSAFE_componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockChainData()
    }
    async loadWeb3() {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }else if(window.web3){
            window.web3= new Web3(window.web3.currentProvider)
        
        }else{
            window.alert('No ethereum browser detected!')
        }
    }

    async loadBlockChainData() {
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        this.setState({account:account[0]})
        const networkId = await web3.eth.net.getId()
        
        //Load thether contract
        const tetherData = Tether.networks[networkId]
        if(tetherData) {
            const tether = new web3.eth.Contract(Tether.abi,tetherData.address)
            this.setState({
                tether
            })
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
            this.setState({ tetherBalance: tetherBalance.toString() })
           
        }else{
            window.alert('Error! Tether contract not deployed to the network')
        }

         //Load RWD contract
         const rwdData = RWD.networks[networkId]
         if(rwdData) {
             const rwd = new web3.eth.Contract(Tether.abi,rwdData.address)
             this.setState({
                 rwd
             })
             let rwdBalance = await rwd.methods.balanceOf(this.state.account).call()
             this.setState({ rwdBalance: rwdBalance.toString() })
             
         }else{
             window.alert('Error! reward contract not deployed to the network')
         }


          //Load decentalbank
        const decentralData = DecentralBank.networks[networkId]
        if(decentralData) {
            const decentralBank = new web3.eth.Contract(DecentralBank.abi,decentralData.address)
            this.setState({
                 decentralBank
            })
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
            this.setState({ stakingBalance: stakingBalance.toString() })
            
        }else{
            window.alert('Error! decentral bank not deployed to the network')
        }
        this.setState({loading: false})
    }

    

    //staking function

    stakeTokens= (amount)=>{
        this.setState({loading: true})
        this.state.tether.methods.approve(this.state.decentralBank._address,amount).send({from: this.state.account}).on('transactionHash',(hash)=>{
        this.state.decentralBank.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash',(hash)=>{
            this.setState({loading: false})
        })
    })
    }

    //unstaking function

    unstakeTokens= ()=>{
        this.setState({loading: true})
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash',(hash)=>{
            this.setState({loading: false})
        })
    }

    constructor(props) {
        super (props)
        this.state = {
            account: '0x0',
            tether: {},
            rwd: {},
            decentralBank:{},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true

        }
    }

    render(){
        let content
        {this.state.loading ?
             content = <p id='loader' className='text-center' style={{margin:'30px', color:'white'}}>LOADING PLEASE...</p> :
              content = <Main
              tetherBalance={this.state.tetherBalance}
              rwdBalance={this.state.rwdBalance}
              stakingBalance={this.state.stakingBalance}
              stakeTokens = {this.stakeTokens}
             unstakeTokens = {this.unstakeTokens}
              />}
        return( 
            <div className='App' style={{position:'relative'}}>
                <div style={{position:'absolute'}}>
                <div>
            <Particles height='100vh' width='100vw'
            id='tsparticles'
           options={{
               background:{
                   color:{
                    value:"#0d47a1"
                   },
               },
               fpsLimit:60,
               interactivity:{
                   detect_on: 'canvas',
                   events:{
                       onClick:{
                           events: 'true',
                           mode:'push',
                       },
                    //    onHover:{
                    //        enable: 'true',
                    //        mode: 'repulse',
                    //    },
                       resize:'true'
                   },
                   modes:{
                       bubble:{
                           distance:400,
                           duration:2,
                           opacity:0.8,
                           size: 40,
                       },
                       push: {
                           quantity: 4,
                       },
                       repulse:{
                           distance: 200,
                           duration: 0.4,
                       },
                
                   },
               },
               particles:{
                   color:{
                       value: '#ffffff',
                   },
                   links: {
                       color: '#ffffff',
                       distance: 150,
                       enable: true,
                       opacity: 0.5,
                       width: 1,
                   },
                   collisions: {
                       enable: true,
                   },
                   move: {
                       direction: 'none',
                       enable: true,
                       outMode:'bounce',
                       random: false,
                       speed: 1,
                       straight: false,
                   },
                   number:{
                       density:{
                           enable: true,
                           value_area: 800,
                       },
                       value: 80,
                   },
                   opacity:{
                       value: 0.5
                   },
                   shape: {
                       type:'circle',
                   },
                   size: {
                       random: true,
                       value: 5,
                   },
               }

           }}
            />
                

        </div>
                </div>
                
               <Navbar account={this.state.account}/>
            <div className='container-fluid mt-5 '>
                <div className='row'>
                    <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:"600px",minHeight:'100px'}}>
                    <div>
                        {content}
                    </div>
                    </main>

                </div>
            
            
            </div>
            </div>
        )
    }
}
export default App;