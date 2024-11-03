import React, { Component } from 'react'
import APIFunctions from "../src/utils/APIFunctions";
import { monthTranslator, getLang, setLanguage } from '../src/utils/common.js'
import { CanvasJSChart } from 'canvasjs-react-charts'
import './css/CustomStyle.css';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            numOfCustomers: "",
            regRequests: "",
            numOfPackages: "",
            numOfCompanies: "",
            sales: null,
            customerPerPackage: null,
            active: null
        };

    }
    componentDidMount() {
        this.changeLang();
        this.getStatistics();
        this.getBarGraph();

       
        

    }

    changeLang(){
        if (getLang() != "en"){
            setLanguage("en");
            window.location.reload(false);
        }
    }

    getBarGraph() {
        APIFunctions.getForBarChart()
            .then((response) => {

                var _customers = response.data.customers;
                var arr = [];
                _customers.map((val, idx) => {
                    var item = new Object();
                    item.label = val.packageName;
                    item.y = val.total;

                    arr.push(item);
                });

                var _sales = response.data.sales;
                var arr2 = [];
                _sales.map((val, idx) => {
                    var item = new Object();
                    item.label = monthTranslator(val.month);
                    item.y = val.total;

                    arr2.push(item);
                });

                var arr3 = [
                    { name: "Activated", y: response.data.active.activeCount },
                    { name: "DeActivated", y: response.data.active.deactivatedCount },
                ]

                this.setState({
                    sales: arr2,
                    customerPerPackage: arr,
                    active: arr3
                });

            })
            .catch((e) => {
                console.log(e);
            });
    }
    getStatistics() {
        APIFunctions.getStatistics()
            .then((response) => {

                this.setState({
                    numOfCompanies: response.data.numOfCompanies,
                    numOfCustomers: response.data.numOfCustomers, regRequests: response.data.regRequests,
                    numOfPackages: response.data.numOfPackages
                });

            })
            .catch((e) => {
                console.log(e);
            });
    }


    render() {
        const options = {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Companies Per Package"
            },
            axisX: {
                title: "Package",
                reversed: true,
            },
            axisY: {
                title: "Number of Companies",
                includeZero: true,
                labelFormatter: this.addSymbols
            },
            data: [{
                type: "bar",
                dataPoints: this.state.customerPerPackage
            }]
        }

        const options2 = {
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Total Registrations Per Month"
            },
            data: [{
                type: "pie",
                startAngle: 75,
                toolTipContent: "<b>{label}</b>: {y}",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 10,
                indexLabel: "{label} - {y}",
                dataPoints: this.state.sales
            }],
        }
        const options3 = {
            animationEnabled: true,
            title: {
                text: "Active/InActive Customer Packages"
            },
            subtitles: [{
                verticalAlign: "center",
                fontSize: 24,
                dockInsidePlotArea: true
            }],
            data: [{
                type: "doughnut",
                showInLegend: true,
                indexLabel: "{name}: {y}",
                yValueFormatString: "#,###''",
                dataPoints: this.state.active
            }]
        }
        return (
            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    {/* <h1 className="m-0 text-dark">Dashboard</h1> */}
                                </div>{/* /.col */}
                            </div>{/* /.row */}
                        </div>{/* /.container-fluid */}
                    </div>
                    {/* /.content-header */}
                    {/* Main content */}
                    <section className="content">
                        <div className="container-fluid">
                            {/* Small boxes (Stat box) */}
                            <div className="row">
                                <div className="col-lg-3 col-6">
                                    {/* small box */}
                                    <div className="small-box bg-info">
                                        <div className="inner">
                                            <h3>{this.state.numOfPackages}</h3>
                                            <p>Number Of Packages</p>
                                        </div>
                                        <div className="icon">
                                            <i className="ion ion-bag" />
                                        </div>
                                        <a href="PackageManagement" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
                                    </div>
                                </div>
                                {/* ./col */}
                                <div className="col-lg-3 col-6">
                                    {/* small box */}
                                    <div className="small-box bg-success">
                                        <div className="inner">
                                            <h3>{this.state.numOfCompanies}</h3>
                                            <p>Total Compnanies</p>
                                        </div>
                                        <div className="icon">
                                            <i className="ion ion-stats-bars" />
                                        </div>
                                        <a href="CompanyPackages" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
                                    </div>
                                </div>
                                {/* ./col */}
                                <div className="col-lg-3 col-6">
                                    {/* small box */}
                                    <div className="small-box bg-warning">
                                        <div className="inner">
                                            <h3>{this.state.regRequests}</h3>
                                            <p>Registration Requests</p>
                                        </div>
                                        <div className="icon">
                                            <i className="ion ion-person-add" />
                                        </div>
                                        <a href="CustomerRegistrations" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
                                    </div>
                                </div>
                                {/* ./col */}
                                <div className="col-lg-3 col-6">
                                    {/* small box */}
                                    <div className="small-box bg-danger">
                                        <div className="inner">
                                            <h3>{this.state.numOfCustomers}</h3>
                                            <p>Total Customers</p>
                                        </div>
                                        <div className="icon">
                                            <i className="ion ion-pie-graph" />
                                        </div>
                                        <a href="CompanyPackages" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
                                    </div>
                                </div>
                                {/* ./col */}
                            </div>
                            <div className="row">
                                <section className="col-lg-12 connectedSortable">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="tab-content p-0">
                                                {this.state.customerPerPackage && <CanvasJSChart options={options} />}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">

                                    </div>
                                </section>
                            </div>

                        </div>

                        <div className='row'>
                            <section className="col-lg-6 connectedSortable">
                                <div className="card">
                                    <div className="card-header border-0">
                                    </div>

                                    <div className="card-body">
                                        <CanvasJSChart options={options2} />
                                        {/* <CanvasJSChart options={options2} style={{width:'50%'}} /> */}
                                    </div>
                                </div>
                            </section>

                            <section className='col-lg-6 connectedSortable'>
                                <div className="card">
                                    <div className="card-header border-0">
                                    </div>
                                    <div className="card-body">
                                        {this.state.active && <CanvasJSChart options={options3} />}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                </div>
            </div>

        )
    }
}
