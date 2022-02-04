class TS extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var data = this.props.pdfData;
        
        var borrower = 
            data.companyName && data.companyNumber ?
                `${data.companyName} (${data.companyNumber})`
                : data.companyName ?
                    data.companyName :
                    null
        return (

            <Grid container spacing={2}>

                <Grid item xs={12} className='offer-name'>{data.offerName} Loan</Grid>

                <Grid item xs={6} className='ts-category' align='right'>Borrower</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{borrower}</Grid>
                <Grid item xs={6} className='ts-category' align='right'>Type of Loan</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.loanType}</Grid>
                <Grid item xs={6} className='ts-category' align='right'>Gross Loan Amount</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.loanAmount}</Grid>
                <Grid item xs={6} className='ts-category' align='right'>Loan Term</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.loanTerm}</Grid>
                <Grid item xs={6} className='ts-category' align='right'>Description</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.description}</Grid>

                <Grid item xs={12} className='ts-title'>Key Features</Grid>

                <Grid item xs={6} className='ts-category' align='right'>Monthly Interest Rate</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.monthlyInterestRate}</Grid>
                <Grid item xs={6} className='ts-category' align='right'>* Facility Fee</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.loanFeeRate}</Grid>
                <Grid item xs={6} className='ts-category' align='right'>* Admin Fee</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.adminFee}</Grid>
                <Grid item xs={6} className='ts-category' align='right'>Introducer Commission</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.brokerFee}</Grid>
                <Grid item xs={6} className='ts-category' align='right'>Default Monthly Interest Rate</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.defaultMonthlyInterestRate}</Grid>
                <Grid item xs={6} className='ts-category' align='right'>Application Fee</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.deposit}</Grid>

                <Grid item xs={12} className='ts-title'>Loan Illustration</Grid>
                <Grid item xs={6} className='ts-category' align='right'>* Interest</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.interestFee}</Grid>
                <Grid item xs={6} className='ts-category' align='right'>* Facility Fee</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.loanFee}</Grid>
                <Grid item xs={6} className='ts-category' align='right'>* Admin Fee</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.adminFee}</Grid>
                <Grid item xs={6} className='ts-category' align='right'>* Estimated Legal & Professional Fees</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.legalFee}</Grid>
                <Grid item xs={6} className='ts-category' align='right'>* Filling, CHAPS and other costs</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.otherCosts}</Grid>
                <Grid item xs={6} className='ts-category' align='right'>Net Loan Advance</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.netLoanAmount}</Grid>

                <Grid item xs={12} className='ts-title'>Other Information</Grid>

                <Grid item xs={6} className='ts-category' align='right'>Repayment</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.repaymentDetails}</Grid>

                {
                    data.productType != 'Working Capital' ?
                    <Grid container spacing={2}>
                        <Grid item xs={6} className='ts-category' align='right'>Other Lenders</Grid>
                        <Grid item xs={6} className='ts-value' align='left'>
                            {
                                data.otherLenders ?
                                    <List disablePadding={true} dense={true}>
                                        {data.otherLenders.map((element, index) => (
                                            <ListItem key={index}>{element}</ListItem>
                                        ))}
                                    </List>
                                    : null
                            }
                        </Grid>
                    </Grid>
                        : null
                }

                <Grid item xs={6} className='ts-category' align='right'>Requirements</Grid>

                <Grid item xs={6} className='ts-value' align='left'>
                    {
                        data.requirements ?
                            
                            <List disablePadding={true} dense={true}>
                                {data.requirements.map((element, index) => (
                                    <ListItem key={index}>{element}</ListItem>
                                ))}
                            </List>
                        
                        : null
                    }
                </Grid>

                <Grid item xs={6} className='ts-category' align='right'>Additional Information</Grid>
                <Grid item xs={6} className='ts-value' align='left'>{data.additionalInfo}</Grid>

                <Grid item xs={12} className='input-label'>* This fee will be deducted from the gross loan amount.</Grid>

            </Grid>

        );
    }
}