class Generator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            activeStepIndex: -1,

            loanType: 'Secured Term Loan',

            mainCompanyName: '',
            mainCompanyNumber: '',
            mainCompanies: [],
            mainMenuIsOpen: false,

            productType: '',
            isTax: false,

            purchaseCost: null,

            givenLoanAmount: null,

            description: '',

            defaultLegalFee: '',
            legalFee: '',

            adminFee: null,

            defaultMonthlyInterestRate: '',
            monthlyInterestRate: '',

            defaultLoanFeeRate: '',
            loanFeeRate: '',

            loanTerm: null,
            loanTermIsDaily: false,

            taxReclaimPeriod: '',

            chargeOnProperty: '',
            floatingCharges: [],

            incomeRate: 0.15,

            mezzanineLenderStatus: '',
            mezzanineCompanyName: '',
            mezzanineCompanyNumber: '',
            mezzanineCompanies: [],
            mezzanineMenuIsOpen: false,

            seniorLenderStatus: '',
            seniorLenderCompanyName: '',
            seniorLenderCompanyNumber: '',
            seniorLenderCompanies: [],
            seniorLenderMenuIsOpen: false,

            additionalInfo: '',

            borrowerEmail: '',
            borrowerName: '',
            brokerEmail: '',
            brokerName: '',

            userName: '',
            userEmail: '',

            pipedriveBcc: '',

            previousVersionsAdsumMemberName: '',
            previousVersionsIsOpen: false,
            previousVersionsFiles: [],
            previousVersionsFileName: '',

            fileName: '',
            fileNameWithPDF: '',
            fileExists: false,
            fileNamePopUpIsOpen: false,

            fillingNeeded: false,
            fillingNeededMsgs: [],

            pdfData: {},
            dbData: {},

            defaultBrokerFeeRate: null,
            brokerFeeRate: null,

            brokerInvolved: false,
            userIsABroker: false,

            action: '',
            actionPerformed: false,

            prerequisitesOpen: true,
            needProductType: false,

            securityIsOpen: false

        };

        this.renderStepper = this.renderStepper.bind(this);

        this.sendDataToBackEnd = this.sendDataToBackEnd.bind(this);
        this.getPreviousVersions = this.getPreviousVersions.bind(this);

        this.renderPreviousVersions = this.renderPreviousVersions.bind(this);

        this.renderCompaniesHouseAutocomplete = this.renderCompaniesHouseAutocomplete.bind(this);
        this.callCompaniesHouseAutocomplete = this.callCompaniesHouseAutocomplete.bind(this);

        this.getTsDetails = this.getTsDetails.bind(this);

        this.checkIfFileExists = this.checkIfFileExists.bind(this);

        this.updateTsWithTsDetails = this.updateTsWithTsDetails.bind(this);

        this.checkFileName = this.checkFileName.bind(this);
        this.checkActionRequired = this.checkActionRequired.bind(this);

        this.renderFileNameForm = this.renderFileNameForm.bind(this);

        this.renderProductTypeButton = this.renderProductTypeButton.bind(this);

    }

    async callCompaniesHouseAutocomplete(search_term, category) {

        const requestOptions = {
            method: 'GET'
        }

        var url = '/autocomplete?q=' + search_term

        var response = await fetch(url, requestOptions)
        var data = await response.json()

        return data.matching_results

    }

    renderFileNameForm() {
        return(
            <FormControl fullWidth>
                <InputLabel>
                    <div className='input-label'>Enter a file name for this termsheet</div>
                </InputLabel>
                <Input
                    value={this.state.fileName}
                    onChange={async () => {
                        var value = event.target.value;
                        var fileNameNoSpace = value.replaceAll(' ', '_')
                        var fileNameNoSlash = fileNameNoSpace.replaceAll('/', '_')
                        var fileNameWithPDF = fileNameNoSlash + '.pdf'

                        this.setState({
                            'fileName': fileNameNoSpace,
                            'fileNameWithPDF': fileNameWithPDF
                        })
                    }}
                    endAdornment={<InputAdornment position='end'>.pdf</InputAdornment>}
                />
            </FormControl>
        )

    }

    renderCompaniesHouseAutocomplete(inputLabel, category) {

        var nameInStateForCompanyName = category + 'CompanyName';
        var nameInStateForCompanies = category + 'Companies';
        var nameInStateForMenuOpen = category + 'MenuIsOpen';

        return (

            <FormControl fullWidth>
                <InputLabel><div className='input-label'>{inputLabel}</div></InputLabel>
                <Input
                    multiline={true}
                    type='text'
                    value={this.state[nameInStateForCompanyName]}
                    onChange={async (event) => {

                        var value = event.target.value;

                        if (category == 'main') {
                            await this.setState({
                                'mainCompanyName': value,
                                'mainMenuIsOpen': true,
                                'mainCompanyNumber': ''
                            })
                        
                        } else if (category == 'mezzanine') {
                            await this.setState({
                                'mezzanineCompanyName': value,
                                'mezzanineMenuIsOpen': true,
                            })
                        } else if (category == 'seniorLender') {
                            await this.setState({
                                'seniorLenderCompanyName': value,
                                'seniorLenderMenuIsOpen': true,
                            })
                        }

                        var companies = await this.callCompaniesHouseAutocomplete(value)

                        if (category == 'main') {
                            this.setState({ 'mainCompanies': companies })
                        } else if (category == 'mezzanine') {
                            this.setState({ 'mezzanineCompanies': companies })
                        } else if (category == 'seniorLender') {
                            this.setState({ 'seniorLenderCompanies': companies })
                        }

                    }}
                />

                {
                    this.state[nameInStateForMenuOpen] && this.state[nameInStateForCompanyName] ?
                        <MenuList>
                            {this.state[nameInStateForCompanies].map((company, index) => (
                                <MenuItem
                                    key={index}
                                    onClick={(event) => {

                                        if (category == 'main') {
                                            this.setState({
                                                'mainCompanyName': company.label,
                                                'mainCompanyNumber': company.value,
                                                'mainMenuIsOpen': false
                                            })
                                        } else if (category == 'mezzanine') {
                                            this.setState({
                                                'mezzanineCompanyName': company.label,
                                                'mezzanineCompanyNumber': company.value,
                                                'mezzanineMenuIsOpen': false
                                            })
                                        } else if (category == 'seniorLender') {
                                            this.setState({
                                                'seniorLenderCompanyName': company.label,
                                                'seniorLenderCompanyNumber': company.value,
                                                'seniorLenderMenuIsOpen': false
                                            })
                                        }
                                    }}
                                    value={company.label}
                                >
                                    {company.label}
                                </MenuItem>
                            ))}
                        </MenuList>
                        : null
                }

            </FormControl>

        )
    }

    renderLoanDetails() {

        return (
            <Grid container spacing={3} className='step' align='left'>

                <Grid item xs={12}>
                    {this.renderCompaniesHouseAutocomplete('Company Name as per Companies House', 'main')}
                </Grid>

                {this.state.productType && this.state.isTax ?
                        
                    <Grid item xs={12}>

                        <FormControl fullWidth>

                            <InputLabel className='input-label'>
                                {['Creative', 'R&D'].includes(this.state.productType) ? 
                                'Claim amount' : 'Purchase / Project Price'}
                            </InputLabel>

                            <Input
                                onWheel={(e) => e.target.blur()}
                                type='number'
                                value={this.state.purchaseCost}
                                onChange={async () => {

                                    var value = event.target.valueAsNumber;

                                    await this.setState({ 'purchaseCost': value });

                                    if (this.state.productType == 'VAT') {
                                        var givenLoanAmount = Math.round(value / 5);
                                        await this.setState({
                                            'givenLoanAmount': givenLoanAmount,
                                            'defaultLegalFee': calculateDefaultLegalFee(givenLoanAmount),
                                            'defaultLoanFeeRate': calculateDefaultLoanFeeRate(
                                                this.state.productType, givenLoanAmount
                                            )
                                        })
                                    }

                                }}

                                startAdornment={<InputAdornment position='start'>£</InputAdornment>}
                            />

                        </FormControl>
                    </Grid>

                : null}

                {
                    this.state.productType ?
                        <Grid item xs={12}>
                            <FormControl fullWidth>

                                <InputLabel className='input-label'>
                                    {
                                        this.state.productType == 'Working Capital' ?
                                        'Loan Amount (total Gross Loan Amount with all fees must be at least £10,000)'
                                        : 'Loan Amount (min £10,000)'
                                    }
                                    <Tooltip title={
                                        this.state.productType == 'Working Capital' ? 
                                        inputTooltips['netLoanAmount']
                                        : inputTooltips['loanAmount']
                                    }>
                                        <i className="fas fa-info-circle gui-tooltip-icon"/>
                                    </Tooltip>  
                                </InputLabel>	

                                <Input
                                    onWheel={(e) => e.target.blur()}
                                    type='number'
                                    value={this.state.givenLoanAmount}
                                    onChange={async () => {

                                        var value = event.target.valueAsNumber;

                                        this.setState({
                                            'givenLoanAmount': value,
                                            'defaultLegalFee': calculateDefaultLegalFee(value),
                                            'defaultLoanFeeRate': calculateDefaultLoanFeeRate(this.state.productType, value),
                                        });
                                    }}
                                    startAdornment={<InputAdornment position='start'>£</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>
                    : null
                }

                {
                    this.state.productType ?
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    <div className='input-label'>Description of purchase / project</div>
                                </InputLabel>
                                <Input
                                    value={this.state.description}
                                    onChange={async () => {
                                        this.setState({ 'description': event.target.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    : null
                }

            </Grid>
        )
    }

    renderNeededInputs() {
        return (

            <Grid container spacing={3} className='step' align='left'>

                {this.props.userIsAdsum ? 
                    <Grid item xs={12}>
                        <div className='popup-text'>Input needed</div>
                    </Grid>
                : null}

                {
                    this.state.productType && this.state.productType != 'VAT' ?

                        <Grid item xs={12}>
                            <div className='button-group-title'>Loan Term (in months)</div>
                            <ButtonGroup>
                                {this.props.buttonsValues['loanTerm'].map((label, index) => (
                                    <Button
                                        key={index}
                                        variant={this.state.loanTerm == label ? 'contained' : 'outlined'}
                                        onClick={ async()=> {

                                            var value = event.target.innerText;
                                            value = parseInt(value)

                                            await this.setState({ 
                                                'loanTerm': value,
                                                'defaultBrokerFeeRate': calculateDefaultBrokerFeeRate(
                                                    this.state.productType, value, this.state.loanTermIsDaily
                                                )
                                            });
                                        }}
                                    >
                                        <div className='font-normal'>{label}</div>
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </Grid>

                    : null

                }

                {
                    this.state.productType && this.state.isTax ?
                        <Grid item xs={12}>
                            <FormControl fullWidth>

                                <InputLabel className='input-label'>
                                    Tax Reclaim Period
                                    <Tooltip title={inputTooltips['taxReclaimPeriod']}>
                                        <i className="fas fa-info-circle gui-tooltip-icon"/>
                                    </Tooltip>  
                                </InputLabel>	

                                <Input
                                    value={this.state.taxReclaimPeriod}
                                    onChange={async () => {
                                        this.setState({ taxReclaimPeriod: event.target.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        : null
                }

            </Grid>
        )
    }


    renderOptionalInputs() {

        var monthlyInterestRate = getRateDisplayValue(this.state.monthlyInterestRate)

        var loanFeeRate = getRateDisplayValue(this.state.loanFeeRate)
        var brokerFeeRate = getRateDisplayValue(this.state.brokerFeeRate)

        return (
            <Grid container spacing={3} className='step' align='left'>

                <Grid item xs={12}>
                    <div className='popup-text'>Optional, auto-generated</div>
                </Grid>

                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>
                            <div className='input-label'>Admin Fees</div>
                        </InputLabel>
                        <Input
                            onWheel={(e) => e.target.blur()}
                            type='number'
                            value={this.state.adminFee}
                            onChange={async () => {
                                this.setState({ adminFee: event.target.valueAsNumber });
                            }}
                            startAdornment={<InputAdornment position='start'>£</InputAdornment>}
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>
                            <div className='input-label'>Legal Fees</div>
                        </InputLabel>
                        <Input
                            type='number'
                            value={this.state.legalFee}
                            onChange={async () => {
                                this.setState({ legalFee: event.target.valueAsNumber });
                            }}
                            startAdornment={<InputAdornment position='start'>£</InputAdornment>}
                        />
                        
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>
                            <div className='input-label'>Monthly Interest Rate</div>
                        </InputLabel>
                        <Input
                            type='number'
                            value={monthlyInterestRate ? monthlyInterestRate : null}
                            onChange={() => {
                                var value = event.target.valueAsNumber;
                                var monthlyInterestRateDecimalFormat = value / 100;
                                this.setState({ 'monthlyInterestRate': monthlyInterestRateDecimalFormat });
                            }}
                            endAdornment={<InputAdornment position='end'>%</InputAdornment>}
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>
                            <div className='input-label'>Loan Fee Rate</div>
                        </InputLabel>
                        <Input
                            type='number'
                            value={loanFeeRate ? loanFeeRate : null}
                            onChange={() => {
                                var value = event.target.valueAsNumber;
                                var loanFeeRateDecimalFormat = value / 100;
                                this.setState({ 'loanFeeRate': loanFeeRateDecimalFormat });
                            }}
                            endAdornment={<InputAdornment position='end'>%</InputAdornment>}
                        />
                    </FormControl>
                </Grid>

                {
                    this.state.brokerInvolved || this.state.userIsABroker ? 
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>
                                <div className='input-label'>Introducer Commission</div>
                            </InputLabel>
                            <Input
                                autoFocus={true}
                                type='number'
                                value={brokerFeeRate ? brokerFeeRate : null}
                                onChange={() => {
                                    var value = event.target.valueAsNumber;
                                    var brokerFeeRateDecimalFormat = value / 100;
                                    this.setState({ 'brokerFeeRate': brokerFeeRateDecimalFormat });
                                }}
                                endAdornment={<InputAdornment position='end'>%</InputAdornment>}
                            />
                        </FormControl>
                    </Grid>
                    : null
                }

            </Grid>
        )
    }

    renderTermsAndRates() {
        return (
            <div>
                {this.renderNeededInputs()}
                {this.props.userIsAdsum ? this.renderOptionalInputs() : null}
            </div>
        );
    }

    renderSecurityAndRepayment() {

        var incomeRate = getRateDisplayValue(this.state.incomeRate)

        return (
            <Grid container spacing={3} className='step' align='left'>

                <Grid item xs={12}>
                    <Button>
                        <Link 
                            underline='always' 
                            className='input-label'
                            onClick={()=> {
                                this.setState({
                                    securityIsOpen: true
                                })
                            }}
                        >
                            What are the security options?
                        </Link>
                    </Button>
                </Grid>
                
                {
                    ['VAT', 'Working Capital'].includes(this.state.productType) ?

                    <Grid item xs={12}>
                        <div className='button-group-title'>Fixed Charge on Property (if applicable)</div>
                        <ButtonGroup orientation='vertical'>
                            {this.props.buttonsValues['chargeOnProperty'].map((label, index) => (
                                <Button
                                    key={index}
                                    variant={this.state.chargeOnProperty == label ? 'contained' : 'outlined'}
                                    onClick={()=> {

                                        var value = event.target.innerText;

                                        if (this.state.chargeOnProperty==value) {
                                            value = ''
                                        }

                                        this.setState({ 
                                            'chargeOnProperty': value,
                                            'defaultMonthlyInterestRate': calculateDefaultMonthlyInterestRate(
                                                this.state.productType, this.state.floatingCharges, value
                                            )
                                        });
                                    }}
                                >
                                    <div className='font-normal'>{label}</div>
                                </Button>
                            ))}
                        </ButtonGroup>
                    </Grid>

                    : null
                }

                <Grid item xs={12}>
                    <div className='button-group-title'>
                        Floating Charge 
                        <Tooltip title='A floating charge is a security interest over a fund of changing assets of a company or other legal person.'>
                            <i className="fas fa-info-circle gui-tooltip-icon"/>
                        </Tooltip>  
                    </div>
                    <ButtonGroup orientation='vertical'>
                        {this.props.buttonsValues['floatingCharges'].map((label, index) => (
                            <Button
                                key={index}
                                variant={this.state.floatingCharges.includes(label) ? 'contained' : 'outlined'}
                                onClick={()=> {
                                    
                                    var value = event.target.innerText;

                                    if (this.state.floatingCharges.includes(value)) {
                                        var floatingCharges = this.state.floatingCharges.filter(function (item) {
                                            return item !== value
                                        })
                                    } else {
                                        var floatingCharges = this.state.floatingCharges.concat(value);
                                    }

                                    this.setState({ 
                                        'floatingCharges': floatingCharges,
                                        'defaultMonthlyInterestRate': calculateDefaultMonthlyInterestRate(
                                            this.state.productType, floatingCharges, this.state.chargeOnProperty
                                        ),
                                    });
                                }}
                            >
                                <div className='font-normal'>{label}</div>
                            </Button>
                        ))}
                    </ButtonGroup>
                </Grid>

                {
                    this.state.productType == 'Working Capital' ?

                    <Grid item xs={6}>
                        <div className='button-group-title'>Percentage of revenue for loan repayment</div>
                        <Input
                            type='number'
                            value={incomeRate ? incomeRate : null}
                            onChange={() => {
                                var value = event.target.valueAsNumber;
                                var incomeRateDecimalFormat = value / 100;
                                this.setState({ 'incomeRate': incomeRateDecimalFormat });
                            }}
                            endAdornment={<InputAdornment position='end'>%</InputAdornment>}
                        />
                    </Grid>
                    : null
                }
            </Grid>
        )
    }

    renderExtraInformation() {

        return (
            <Grid container spacing={3} className='step' align='left'>

                {this.state.productType == 'VAT' ?
                    <Grid item xs={12}>
                        <div className='button-group-title'>
                            Senior Lender
                            <Tooltip title='Financial institutions, banks and multilateral lending agencies including their successors and assigns, who have agreed to guarantee or provide finance to the borrower.'>
                                <i className="fas fa-info-circle gui-tooltip-icon"/>
                            </Tooltip>
                        </div>
                        <ButtonGroup orientation='vertical'>
                            {this.props.buttonsValues['seniorLenderStatus'].map((label, index) => (
                                <Button
                                    key={index}
                                    variant={this.state.seniorLenderStatus == label ? 'contained' : 'outlined'}
                                    onClick={()=> {

                                        var value = event.target.innerText;

                                        if (this.state.seniorLenderStatus==value) {
                                            value = ''
                                        }

                                        this.setState({ 
                                            'seniorLenderStatus': value,
                                        });
                                    }}
                                >
                                    <div className='font-normal'>{label}</div>
                                </Button>
                            ))}
                        </ButtonGroup>
                        {
                            this.state.seniorLenderStatus == 'Senior Lender Known' ?
                                this.renderCompaniesHouseAutocomplete('Senior Lender', 'seniorLender')
                                : null
                        }
                    </Grid>
                    : null
                }

                {this.state.productType == 'VAT' ?
                    <Grid item xs={12}>
                        <div className='button-group-title'>
                            Mezzanine Lender
                            <Tooltip title='Mezzanine financing is a capital resource that sits between (less risky) senior debt and (higher risk) equity that has both debt and equity features.'>
                                <i className="fas fa-info-circle gui-tooltip-icon"/>
                            </Tooltip>
                        </div>
                        <ButtonGroup orientation='vertical'>
                            {this.props.buttonsValues['mezzanineLenderStatus'].map((label, index) => (
                                <Button
                                    key={index}
                                    variant={this.state.mezzanineLenderStatus == label ? 'contained' : 'outlined'}
                                    onClick={()=> {

                                        var value = event.target.innerText;

                                        if (this.state.mezzanineLenderStatus==value) {
                                            value = ''
                                        }

                                        this.setState({ 
                                            'mezzanineLenderStatus': value,
                                        });
                                    }}
                                >
                                    <div className='font-normal'>{label}</div>
                                </Button>
                            ))}
                        </ButtonGroup>
                        {
                            this.state.mezzanineLenderStatus == 'Mezzanine Lender Known' ?
                                this.renderCompaniesHouseAutocomplete('Mezzanine Lender', 'mezzanine')
                                : null
                        }
                    </Grid>
                    : null
                }

                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>
                            <div className='input-label'>Additional Information</div>
                        </InputLabel>
                        <Input
                            value={this.state.additionalInfo}
                            onChange={async () => {
                                this.setState({ 'additionalInfo': event.target.value });
                            }}
                        />
                    </FormControl>
                </Grid>

                {
                    this.props.userIsAdsum ?
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>
                                <div className='input-label'>PipeDrive BCC Ref</div>
                            </InputLabel>
                            <Input
                                value={this.state.pipedriveBcc}
                                onChange={async () => {
                                    this.setState({ 'pipedriveBcc': event.target.value });
                                }}
                            />
                        </FormControl>
                    </Grid>
                    : null
                }

                {
                    this.props.userIsAdsum ?

                    <Grid item xs={12}>
                        <ButtonGroup>
                            {this.props.buttonsValues['adsumMemberName'].map((label, index) => (
                                <Button
                                    key={index}
                                    variant={this.state.userName == label ? 'contained' : 'outlined'}
                                    onClick={ async()=> {
                                        var value = event.target.innerText;
                                        await this.setState({ 
                                            userName: value,
                                            userEmail: adsumMembers[value]
                                        });
                                    }}
                                >
                                    <div className='font-normal'>{label}</div>
                                </Button>
                            ))}
                        </ButtonGroup>
                    </Grid>

                    : null
                }

                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>
                            <div className='input-label'>Your name</div>
                        </InputLabel>
                        <Input
                            value={this.state.userName}
                            onChange={() => {
                                var value = event.target.value;
                                this.setState({ 
                                    userName : value
                                });
                            }}
                        />
                    </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>
                            <div className='input-label'>Your email</div>
                        </InputLabel>
                        <Input
                            value={this.state.userEmail}
                            onChange={async () => {
                                this.setState({ 'userEmail': event.target.value });
                            }}
                        />
                    </FormControl>
                </Grid>

                {
                    this.props.userIsAdsum || this.state.userIsABroker ?
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    <div className='input-label'>Borrower's name</div>
                                </InputLabel>
                                <Input
                                    value={this.state.borrowerName}
                                    onChange={async () => {
                                        this.setState({ 'borrowerName': event.target.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    : null
                }

                {
                    this.props.userIsAdsum || this.state.userIsABroker ?
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    <div className='input-label'>Borrower's email</div>
                                </InputLabel>
                                <Input
                                    value={this.state.borrowerEmail}
                                    onChange={async () => {
                                        this.setState({ 'borrowerEmail': event.target.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    : null
                }

                {
                    this.props.userIsAdsum && this.state.brokerInvolved ?
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    <div className='input-label'>Broker's name</div>
                                </InputLabel>
                                <Input
                                    value={this.state.brokerName}
                                    onChange={async () => {
                                        this.setState({ 'brokerName': event.target.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    : null
                }

                {
                    this.props.userIsAdsum && this.state.brokerInvolved ?
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    <div className='input-label'>Broker's email</div>
                                </InputLabel>
                                <Input
                                    value={this.state.brokerEmail}
                                    onChange={async () => {
                                        this.setState({ 'brokerEmail': event.target.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    : null
                }

            </Grid>
        );
    }
    
    renderStepper() {

        const stepsTitle = [
            'Loan Details', 'Terms and Rates', 'Security & Repayment', 'Extra Information'
        ];

        return (

            <Container>
                <Stepper
                    nonLinear
                    id='gui-stepper'
                    activeStep={this.state.activeStepIndex}
                    orientation="vertical"
                >
                    {stepsTitle.map((label, index) => (
                        <Step key={label}>
                            <StepButton onClick={async () => {

                                if (index == this.state.activeStepIndex) {
                                    await this.setState({ activeStepIndex: -1 })
                                } else {
                                    await this.setState({ activeStepIndex: index })
                                }

                            }}>
                                {label}
                            </StepButton>

                            <StepContent>
                                {
                                    this.state.activeStepIndex == 0 ?
                                        this.renderLoanDetails()
                                        : this.state.activeStepIndex == 1 ?
                                            this.renderTermsAndRates()
                                            : this.state.activeStepIndex == 2 ?
                                                this.renderSecurityAndRepayment()
                                                : this.state.activeStepIndex == 3 ?
                                                    this.renderExtraInformation()
                                                    : null
                                }
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </Container>
        )
    }
    async checkIfFileExists(fileNameWithPDF) {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'fileName': fileNameWithPDF })
        }

        var response = await fetch('/gui_check_if_file_exists', requestOptions)
        var data = await response.json()
        var fileExists = data['exists']

        return fileExists
    }

    async sendDataToBackEnd(pdfData, dbData) {

        if (!this.props.userIsAdsum) {

            var description = 
                this.state.userIsABroker ? 
                    'From broker; ' + this.state.description
                : 'From direct client; ' + this.state.description

            var quoteData = {
                'name': this.state.userName,
                'email': this.state.userEmail,
                'company_name': this.state.mainCompanyName,
                'description':description,
                'loan_type': this.state.productType,
                'facility_amount': dbData.loanAmount,
            }

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quoteData)
            }

            var response = await fetch('/add_deal_to_pipedrive', requestOptions)
            var data = await response.json()
            var bccEmail = data.bcc_email;

        } 

        var data = {
            'workflowData': {
                'fileName': this.state.fileNameWithPDF,
                'action': this.state.action,
            },
            'pdfData': pdfData,
            'dbData': dbData,
            'userIsAdsum': this.props.userIsAdsum,
            'pipedriveBcc': this.props.userIsAdsum ? this.state.pipedriveBcc : bccEmail
        }

        var APIRequest = new XMLReq();
        APIRequest.sendData("POST", '/gui_termsheet_flow', data, true, false);

        this.setState({ 
            fileNamePopUpIsOpen: false,
            actionPerformed: true
        })

    }


    async getPreviousVersions() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        var response = await fetch('/gui_get_ts_files', requestOptions)

        if (response.status == 200) {
            var data = await response.json()
            this.setState({ previousVersionsFiles: data })
        }

    }

    updateTsWithTsDetails(data) {

        if ('company_name' in data) {
            this.setState({ mainCompanyName: data.company_name })
        }

        if ('company_number' in data) {
            this.setState({ mainCompanyNumber: data.company_number })
        }

        if ('description' in data) {
            this.setState({ description: data.description })
        }

        if ('requirements' in data) {

            if (data.requirements) {

                var requirements = String(data.requirements)
                requirements = requirements.replaceAll("\"", "")
                requirements = requirements.replaceAll("{", "")
                requirements = requirements.replaceAll("}", "")
                requirements = requirements.replaceAll('"', "")
                requirements = requirements.split(',')

                var floatingCharges = requirements.filter(
                    requirement => buttonsValues['floatingCharges'].includes(requirement)
                )
                var chargeOnProperty = requirements.filter(
                    requirement => buttonsValues['chargeOnProperty'].includes(requirement)
                )[0]

            } else {
                var floatingCharges = []
                var chargeOnProperty = ''
            }

            this.setState({ floatingCharges: floatingCharges })
            this.setState({ chargeOnProperty: chargeOnProperty })

        }

        if ('loan_fee_rate' in data) {
            this.setState({ loanFeeRate: data.loan_fee_rate })
        }

        if ('monthly_interest_rate' in data) {
            this.setState({ monthlyInterestRate: data.monthly_interest_rate })
        }

        if ('admin_fee' in data) {
            this.setState({ adminFee: data.admin_fee })
        }

        if ('product_type' in data) {

            this.setState({
                productType: data.product_type == 'Business Loan' ? 'Working Capital' : data.product_type,
                isTax: ['VAT', 'Creative', 'R&D'].includes(data.product_type) ? true : false,
                'defaultLoanFeeRate': calculateDefaultLoanFeeRate(data.product_type, this.state.givenLoanAmount)
            })

            if (data.product_type == 'Business Loan') {
                if ('net_loan_amount' in data) {
                    this.setState({
                        givenLoanAmount: data.net_loan_amount,
                        'defaultLegalFee': calculateDefaultLegalFee(data.net_loan_amount),
                    })
                }
            } else {
                if ('loan_amount' in data) {
                    this.setState({
                        givenLoanAmount: data.loan_amount,
                        'defaultLegalFee': calculateDefaultLegalFee(data.loan_amount),
                    })
                }
            }

            if ('loan_term' in data && 'loan_term_is_daily' in data) {
                this.setState({
                    'defaultBrokerFeeRate': calculateDefaultBrokerFeeRate(
                        data.product_type, data.loan_term, data.loan_term_is_daily
                    ),
                    'loanTerm': data.loan_term,
                    'loanTermIsDaily': data.loan_term_is_daily
                })
            }
        }

        if ('deposit' in data) {
            this.setState({ deposit: data.deposit })
        }

        if ('interest_fee' in data) {
            this.setState({ interestFee: data.interest_fee })
        }

        if ('legal_fee' in data) {
            this.setState({ legalFee: data.legal_fee })
        }

        if ('additional_info' in data) {
            this.setState({ additionalInfo: data.additional_info})
        }

        if ('repayment_details' in data) {
            this.setState({ repaymentDetails: data.repayment_details })
        }

        if ('loan_type' in data) {
            this.setState({ loanType: data.loan_type })
        }

        if ('other_costs' in data) {
            this.setState({ otherCosts: data.other_costs })
        }

        if ('purchase_cost' in data) {
            this.setState({ purchaseCost: data.purchase_cost })
        }

        if ('tax_reclaim_period' in data) {
            this.setState({ taxReclaimPeriod: data.tax_reclaim_period })
        }

        if ('pipedrive_bcc' in data) {
            this.setState({ pipedriveBcc: data.pipedrive_bcc })
        }

        if ('senior_lender_status' in data) {
            this.setState({ seniorLenderStatus: data.senior_lender_status })
        }

        if ('mezzanine_lender_status' in data) {
            this.setState({ mezzanineLenderStatus: data.mezzanine_lender_status })
        }

        if ('senior_lender' in data) {
            this.setState({ seniorLenderCompanyName: data.senior_lender })
        }

        if ('mezzanine_lender' in data) {
            this.setState({ mezzanineCompanyName: data.mezzanine_lender })
        }

        if ('income_rate' in data) {
            this.setState({ incomeRate: data.income_rate })
        }


        if (this.props.userIsAdsum) {

            if ('adsum_member_name' in data) {
                this.setState({ userName: data.adsum_member_name })
            }

            if ('adsum_member_email' in data) {
                this.setState({ userEmail: data.adsum_member_email })
            }

            if ('borrower_name' in data) {
                this.setState({ borrowerName: data.borrower_name })
            }

            if ('borrower_email' in data) {
                this.setState({ borrowerEmail: data.borrower_email })
            }

            if ('broker_involved' in data) {

                this.setState({ brokerInvolved: data.broker_involved })

                if (data.broker_involved) {
                    if ('broker_name' in data) {
                        this.setState({ brokerName: data.broker_name })
                    }

                    if ('broker_email' in data) {
                        this.setState({ brokerEmail: data.broker_email })
                    }
                }

            }

        } else {

            if ('user_is_a_broker' in data) {

                this.setState({ userIsABroker: data.user_is_a_broker })

                if (data.user_is_a_broker) {

                    if ('broker_name' in data) {
                        this.setState({ userName: data.broker_name })
                    }

                    if ('broker_email' in data) {
                        this.setState({ userEmail: data.broker_email })
                    }

                    if ('borrower_name' in data) {
                        this.setState({ borrowerName: data.borrower_name })
                    }

                    if ('borrower_email' in data) {
                        this.setState({ borrowerEmail: data.borrower_email })
                    }
                    
                } else {

                    if ('borrower_name' in data) {
                        this.setState({ userName: data.borrower_name })
                    }

                    if ('borrower_email' in data) {
                        this.setState({ userEmail: data.borrower_email })
                    }

                }
            }

        }

        if (this.props.userIsAdsum){
            if ('broker_fee_rate' in data) {
                this.setState({ brokerFeeRate: data.broker_fee_rate })
            }
        }

    }

    async getTsDetails(fileName) {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'fileName': fileName })
        }

        var response = await fetch('/gui_get_ts_from_filename', requestOptions)
        var data = await response.json()

        await this.updateTsWithTsDetails(data)

    }

    renderPreviousVersions() {

        var files = this.state.previousVersionsFiles;


        if (this.state.previousVersionsAdsumMemberName) {
            files = files.filter((file) => file.adsum_member_name == this.state.previousVersionsAdsumMemberName);
        }

        if (files.length > 0) {
            return (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>File name</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Adsum Member</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                            </TableRow>
                            {files.map((file) => (
                                <TableRow key={file.fileName}>
                                    <TableCell>
                                        <Link
                                            component='button'
                                            color='inherit'
                                            onClick={() => {
                                                this.getTsDetails(file.file_name),
                                                    this.setState({ previousVersionsIsOpen: false })
                                            }}
                                        >
                                            {file.file_name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{file.company_name}</TableCell>
                                    <TableCell>{file.date}</TableCell>
                                    <TableCell>{file.adsum_member_name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )

        } else {
            return (
                <div className='popup text'>No termsheet was created by this person</div>
            )
            
        }

    }

    autoPopulateFileName() {

        var today = getTodayDate('pdf')
        today = today.replaceAll(' ', '_')

        var fileName = `${this.state.mainCompanyName}_${today}`
        fileName = fileName.replaceAll(' ', '_')
        var fileNameWithPDF = fileName + '.pdf'

        this.setState({
            'fileName': fileName,
            'fileNameWithPDF': fileNameWithPDF
        })
    }

    async checkActionRequired(loanAmount) {

        var fillingNeededMsgs = []

        if (!this.state.userName) {
            fillingNeededMsgs = fillingNeededMsgs.concat('Please tell us who you are.')
        } 
        
        if (!this.state.userEmail) {
            fillingNeededMsgs = fillingNeededMsgs.concat('Please enter your email.')
        }

        if (!this.state.loanTerm) {
            fillingNeededMsgs = fillingNeededMsgs.concat('Please enter a loan term.')
        }

        if (this.state.borrowerName && !this.state.borrowerEmail) {
            fillingNeededMsgs = fillingNeededMsgs.concat("You have only entered the borrower's name. If you wish to send them this termsheet, you need to enter their email too.")
        } 
        
        if (this.state.brokerName && !this.state.brokerEmail) {
            fillingNeededMsgs = fillingNeededMsgs.concat("You have only entered the broker's name. If you wish to send them this termsheet, you need to enter their email too.")
        }
        
        if (!this.state.mainCompanyName && !this.props.userIsAdsum) {
            fillingNeededMsgs = fillingNeededMsgs.concat("Please enter a company. If you don't know its name on Companies House, just enter the closest name, without selecting.")
        }
        
        if (this.state.userEmail && !checkEmail(this.state.userEmail)) {
            fillingNeededMsgs = fillingNeededMsgs.concat("Oops! There seems to have a typo in your email, could you fix it?")
        }
        
        if (this.state.borrowerEmail && !checkEmail(this.state.borrowerEmail)) {
            fillingNeededMsgs = fillingNeededMsgs.concat("Oops! There seems to have a typo in the borrower email, could you fix it?")
        }
        
        if (this.state.brokerEmail && !checkEmail(this.state.brokerEmail)) {
            fillingNeededMsgs = fillingNeededMsgs.concat("Oops! There seems to have a typo in the broker email, could you fix it?")
        }

        if (!loanAmount) {
            fillingNeededMsgs = fillingNeededMsgs.concat("Please enter a loan amount.")
        }
        
        if (loanAmount && loanAmount < 10000) {
            fillingNeededMsgs = fillingNeededMsgs.concat("Your Gross Loan Amount needs to be at least £10,000.")
        }
        
        if (loanAmount && loanAmount > 5000000) {
            fillingNeededMsgs = fillingNeededMsgs.concat("Your Gross Loan Amount cannot be bigger than £25,000,000.")
        }
        
        if (this.state.incomeRate && this.state.incomeRate < 0.1) {
            fillingNeededMsgs = fillingNeededMsgs.concat("The percentage of revenue needs to be at least 10%.")
        }

        if (fillingNeededMsgs.length > 0) {
            this.setState({ 
                fillingNeededMsgs: fillingNeededMsgs,
                fillingNeeded: true
            })
        } else {
            await this.autoPopulateFileName()
            this.setState({ fileNamePopUpIsOpen: true})
        }

    }

    async checkFileName() {

        if (this.state.fileExists) {
            this.setState({ fileNamePopUpIsOpen: false})
            return true

        } else {

            var fileExists = await this.checkIfFileExists(this.state.fileNameWithPDF)

            if (fileExists) {
                await this.setState({ fileExists: true })
                return false
            } else {
                this.setState({ fileNamePopUpIsOpen: false})
                return true
            }
        }

    }

    renderProductTypeButton(label, index) {

        return (
            <Button
                id='button-product-type'
                variant={this.state.productType == label ? 'contained' : 'outlined'}
                onClick={ async()=> {

                    var value = event.target.innerText;

                    if (value != 'Working Capital (coming soon!)') {

                        var isTax = ['VAT', 'Creative', 'R&D'].includes(value) ? true : false
                        var canHaveChargeOnProperty = ['VAT', 'Working Capital'].includes(value) ? true : false

                        await this.setState({
                            'productType': value.replace(/^\s+|\s+$/g, ''),
                            'defaultLoanFeeRate': calculateDefaultLoanFeeRate(value, this.state.givenLoanAmount),
                            'defaultMonthlyInterestRate': calculateDefaultMonthlyInterestRate(
                                value, this.state.floatingCharges, this.state.chargeOnProperty
                            ),
                            'defaultBrokerFeeRate': calculateDefaultBrokerFeeRate(
                                value, this.state.loanTerm, this.state.loanTermIsDaily
                            ),
                            'isTax': isTax,
                            'canHaveChargeOnProperty': canHaveChargeOnProperty
                        });

                        if (isTax) {
                            await this.setState({ 'loanTermIsDaily': false })
                        }

                        if (value=='VAT') {
                            await this.setState({ 'loanTerm': 3 })
                        }
                    }

                }}
            >
                <div className='font-normal'>{label}</div>
            </Button>
        )

    }

    render() {

        var mainCompanyNumber =
            this.state.mainCompanyName ?
                this.state.mainCompanyNumber
                : ''

        var requirements =
            this.state.chargeOnProperty && this.state.floatingCharges.length > 0 ?
                [this.state.chargeOnProperty].concat(this.state.floatingCharges)
                : this.state.floatingCharges.length > 0 ?
                    this.state.floatingCharges
                    : this.state.chargeOnProperty ?
                        [this.state.chargeOnProperty] :
                        ''

        var loanFeeRate = this.state.loanFeeRate ? this.state.loanFeeRate : this.state.defaultLoanFeeRate

        if (loanFeeRate) {
            var nDecimals = loanFeeRate ? countDecimals(loanFeeRate) : '';
            if (nDecimals <= 2) {
                var loanFeeRateDisplay = `${Math.round(loanFeeRate * 10000) / 100}.00%`
            } else {
                var loanFeeRateDisplay = `${Math.round(loanFeeRate * 10000) / 100}%`
            }
            
        } else {
            var loanFeeRateDisplay = ''
        }

        var monthlyInterestRate = this.state.monthlyInterestRate ? this.state.monthlyInterestRate : this.state.defaultMonthlyInterestRate
        var monthlyInterestRateDisplay = monthlyInterestRate ? `${Math.round(monthlyInterestRate * 10000) / 100}% per month` : ''

        var legalFee = this.state.legalFee ? this.state.legalFee : this.state.defaultLegalFee;
        legalFee = legalFee ? Math.round(legalFee) : null;
        var legalFeeDisplay = legalFee ? `£${numberWithCommas(legalFee)}` : '';

        var deposit = legalFee;
        var depositDisplay = deposit ? `£${numberWithCommas(legalFee)}` : '';
        var depositWithSentenceDisplay = depositDisplay ? depositDisplay + ' payable in advance.' : ''

        var adminFee = this.state.adminFee ? this.state.adminFee : 0;
        var adminFeeDisplay = adminFee > 0 ? `£${Math.round(adminFee)}` : 'Waived'

        var otherCosts = 157
        var otherCostsDisplay = `£${numberWithCommas(otherCosts)}`;

        var loanTermInMonths = convertTermInMonths(this.state.loanTerm, this.state.loanTermIsDaily)
        var loanTermInMonthsDisplay =
            loanTermInMonths ?
                loanTermInMonths < 2 ?
                    `${loanTermInMonths} month`
                    : `${loanTermInMonths} months`
                : ''

        var givenLoanAmount = this.state.givenLoanAmount ? Math.round(this.state.givenLoanAmount) : null;
        var interestFee = calculateInterestFee(givenLoanAmount, monthlyInterestRate, loanTermInMonths);
        var loanFee = calculateLoanFee(givenLoanAmount, loanFeeRate);

        var brokerFeeRate = this.state.brokerFeeRate ? this.state.brokerFeeRate : this.state.defaultBrokerFeeRate;

        var loanAmount =
            this.state.productType == 'Working Capital' ?
                calculateBusinessLoanAmount(
                    givenLoanAmount, legalFee, deposit, monthlyInterestRate, loanTermInMonths, loanFeeRate, otherCosts, adminFee
                )
                : givenLoanAmount
        loanAmount = Math.round(loanAmount);

        var loanAmountDisplay = loanAmount ? `£${numberWithCommas(loanAmount)}` : '';

        var brokerFee = this.state.brokerInvolved || this.state.userIsABroker ? calculateBrokerFee(loanAmount, brokerFeeRate) : null;
        var brokerFeeDisplay = brokerFee ? `£${numberWithCommas(brokerFee)}` : '-';

        loanFee = calculateBusinessLoanFee(this.state.productType, loanFee, loanAmount, loanFeeRate);
        interestFee = calculateBusinessInterestFee(this.state.productType, interestFee, loanAmount, monthlyInterestRate, loanTermInMonths);

        var loanFeeDisplay = loanFee ? `£${numberWithCommas(loanFee)}` : '';
        var interestFeeDisplay = interestFee ? `£${numberWithCommas(interestFee)}` : '';

        if (this.state.productType == 'Working Capital') {
            var netLoanAmount = calculateNetLoanAmount(
                loanAmount, interestFee, loanFee, adminFee, otherCosts, deposit, legalFee
            )
            if (netLoanAmount != this.state.givenLoanAmount) {
                interestFee = interestFee - (this.state.givenLoanAmount - netLoanAmount)
                interestFeeDisplay = interestFee ? `£${numberWithCommas(interestFee)}` : '';
                netLoanAmount = calculateNetLoanAmount(
                    loanAmount, interestFee, loanFee, adminFee, otherCosts, deposit, legalFee
                )
            }
        } else {
            var netLoanAmount = calculateNetLoanAmount(
                givenLoanAmount, interestFee, loanFee, adminFee, otherCosts, deposit, legalFee
            )
        }

        var netLoanAmountDisplay = netLoanAmount ? `£${numberWithCommas(netLoanAmount)}` : '';

        var mezzanineCompanyName = this.state.mezzanineCompanyName ?  cleanCompanyName(this.state.mezzanineCompanyName) : ''
        var seniorLenderCompanyName = this.state.seniorLenderCompanyName ? cleanCompanyName(this.state.seniorLenderCompanyName) : ''

        var otherLenders =
            mezzanineCompanyName && seniorLenderCompanyName ?
                [mezzanineCompanyName, seniorLenderCompanyName]
                : mezzanineCompanyName ?
                    [mezzanineCompanyName]
                    : seniorLenderCompanyName ?
                        [seniorLenderCompanyName]
                        : '';

        // repaymentDetails

        var incomeRateDisplay = this.state.incomeRate ? `${Math.round(this.state.incomeRate * 10000) / 100}%` : null
        var repaymentDetails = 
            this.state.productType ?
                this.state.productType == 'Working Capital' ?
                `The loan will be repaid by (1) a monthly payment of ${incomeRateDisplay} of monthly income as per Open Banking or a minimum monthly amount that is determined by Adsum during due diligence based on your net cash forecast (2) bullet payment of the balance of the loan. Early repayment is permitted.`
                : 'HMRC refund at the end of the loan.'
            : null;

        var additionalInfo = this.state.additionalInfo

        // People

        var adsumMemberName = this.props.userIsAdsum ? this.state.userName : 'Mike'
        var adsumMemberEmail = this.props.userIsAdsum ? this.state.userEmail : 'mike.underwood@adsum-works.com'

        var brokerName = this.state.userIsABroker ? this.state.userName : this.state.brokerName
        var brokerEmail = this.state.userIsABroker ? this.state.userEmail : this.state.brokerEmail

        var borrowerName = 
            !this.state.userIsABroker && !this.props.userIsAdsum ? 
                this.state.userName 
            : 
                this.state.borrowerName

        var borrowerEmail =
            !this.state.userIsABroker && !this.props.userIsAdsum ?
                this.state.userEmail
            : 
                this.state.borrowerEmail


        // Email and PDF

        var dearSentence = 
            // If we have both the broker and the borrower name,
            // we just address the broker
            borrowerName ? `Dear ${borrowerName},`
            : brokerName ? `Dear ${brokerName},`	
            : 'Dear Sir/Madam,'

        var offerName = this.state.productType == 'Working Capital' ? 'Business' : 'Tax'

        var mailto = 'mailto:' + adsumMemberEmail + '?subject=My Loan Application'

        // Frontend message

        var emailPopUpText =
            this.props.userIsAdsum ?
                borrowerName && brokerName ?
                    `The termsheet will be sent to ${borrowerName}, ${brokerName} and you.`
                : borrowerName ?
                    `The termsheet will be sent to ${borrowerName} and you.`
                : brokerName ?
                    `The termsheet will be sent to ${brokerName} and you.`
                : 'The termsheet will only be sent to you.'
            : this.state.userIsABroker ?
                borrowerEmail ?
                    `The termsheet will be sent to ${borrowerName} and you.`
                : 'The termsheet will only be sent to you.'
            : null;

        // Gathered data

        var commonData = {
            'companyNumber': mainCompanyNumber,
            'description': this.state.description,
            'loanType': 'Secured Term Loan',
            'requirements': requirements,
            'productType': this.state.productType,
            'repaymentDetails': repaymentDetails,
            'adsumMemberName': adsumMemberName,
            'adsumMemberEmail': adsumMemberEmail
        }

        var pdfData = {

            'companyName': 
                this.state.mainCompanyName ? 
                cleanCompanyName(this.state.mainCompanyName) 
                : '',
            'date': getTodayDate('pdf'),
            'loanTerm': loanTermInMonthsDisplay,
            'loanFeeRate': loanFeeRateDisplay,
            'monthlyInterestRate': monthlyInterestRateDisplay,
            'adminFee': adminFeeDisplay,
            'defaultMonthlyInterestRate': '3.99% per month',
            'loanAmount': loanAmountDisplay,
            'deposit': depositDisplay,
            'depositWithSentence': depositWithSentenceDisplay,
            'interestFee': interestFeeDisplay,
            'loanFee': loanFeeDisplay,
            'legalFee': legalFeeDisplay,
            'otherCosts': otherCostsDisplay,
            'netLoanAmount': netLoanAmountDisplay,
            'otherLenders': otherLenders,
            'brokerFee': brokerFeeDisplay,
            'additionalInfo': additionalInfo,

            'dearSentence': dearSentence,
            'offerName': offerName,
            'mailto': mailto,

        }

        pdfData = { ...commonData, ...pdfData };

        var dbData = {
            'companyName': this.state.mainCompanyName,
            'epoch': Date.now(),
            'date': getTodayDate('db'),
            'loanFeeRate': loanFeeRate,
            'monthlyInterestRate': monthlyInterestRate,
            'brokerFee': brokerFee,
            'adminFee': adminFee,
            'defaultMonthlyInterestRate': 0.0399,
            'loanAmount': loanAmount,
            'deposit': deposit,
            'interestFee': interestFee,
            'loanFee': loanFee,
            'legalFee': legalFee,
            'otherCosts': otherCosts,
            'netLoanAmount': netLoanAmount,
            'purchaseCost': this.state.purchaseCost,
            'loanTerm': this.state.loanTerm,
            'loanTermIsDaily': this.state.loanTermIsDaily,
            'taxReclaimPeriod': this.state.taxReclaimPeriod,
            'seniorLenderStatus': this.state.seniorLenderStatus,
            'mezzanineLenderStatus': this.state.mezzanineLenderStatus,
            'seniorLender': this.state.seniorLenderCompanyName,
            'mezzanineLender': this.state.mezzanineCompanyName,
            'borrowerName': borrowerName,
            'borrowerEmail': borrowerEmail,
            'brokerName': brokerName,
            'brokerEmail': brokerEmail,
            'incomeRate': this.state.incomeRate,
            'additionalInfo': this.state.additionalInfo,
            'brokerFeeRate': brokerFeeRate,
            'userIsABroker': this.state.userIsABroker,
            'brokerInvolved': this.state.brokerInvolved,
            'minimumLoanTerm': 3,
            'minimumLoanTermIsDaily': false,
        }

        dbData = { ...commonData, ...dbData };

        const theme = createTheme({
            typography: {
                button: {
                    textTransform: 'none',
                    justifyContent: "flex-start"
                }
            },
            palette: {
                primary: { main: '#8ec8c5' },
                secondary: { main: '#517899' }
            },
            stepper: {
                iconColor: 'white'
            }
        });

        return (
            <div id='generator-section'>
                <div id='generator-section-title'>Termsheet Generator</div>
                <ThemeProvider theme={theme}>

                    <Grid container spacing={0} align='center' justifyContent='center'>

                        <Grid item xs={12} align='right' className='icons'>

                            <Modal
                                open={this.state.prerequisitesOpen}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                            >
                                <Fade className='popup popup-gui-prerequisites' in={this.state.prerequisitesOpen}>
                                    <Grid container spacing={2} align='center' justifyContent='center'>

                                        {
                                            !this.props.userIsAdsum ?
                                            <Grid item xs={12} className='popup-text'>
                                                Our partners usually spend no more than a few minutes to create their termsheet.
                                            </Grid>
                                            : null
                                        }

                                        {
                                            this.props.userIsAdsum ?
                                                <Grid item xs={12} align='right'>
                                                    <Tooltip title='Previous versions'>
                                                        <IconButton
                                                            className='button-icon'
                                                            onClick={ async() => {
                                                                await this.getPreviousVersions();
                                                                this.setState({
                                                                    previousVersionsIsOpen: true,
                                                                    prerequisitesOpen: false
                                                                })
                                                            }}
                                                        >
                                                            <i className='fas fa-calendar' id='previousVersionsPopUpIcon'/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            : null
                                        }

                                        <Grid item xs={12}>
                                            <div className='input-label'>
                                                {this.props.userIsAdsum ? 'Product Type' : 'What can we fund for you?'}
                                            </div>
                                            <ButtonGroup orientation='vertical'>
                                                {this.props.buttonsValues['productType'].map((label, index) => (
                                                    this.renderProductTypeButton(label, index)
                                                ))}
                                            </ButtonGroup>
                                        </Grid>

                                        {
                                            this.props.userIsAdsum ?

                                                <Grid item xs={12}>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={this.state.brokerInvolved}
                                                                onChange={() => {
                                                                    this.setState({ brokerInvolved: !this.state.brokerInvolved })
                                                                }}
                                                                color="secondary"
                                                            />
                                                        }
                                                        label={<div className='input-label'>Is there a broker involved?</div>}
                                                    />
                                                </Grid>
                                            :
                                                <Grid item xs={12}>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={this.state.userIsABroker}
                                                                onChange={() => {
                                                                    this.setState({ userIsABroker: !this.state.userIsABroker })
                                                                }}
                                                                color="secondary"
                                                            />
                                                        }
                                                        label={<div className='input-label'>Are you acting on behalf of a client?</div>}
                                                    />
                                                </Grid>
                                        }


                                        {
                                            this.state.needProductType ?
                                            <Grid item xs={12}>
                                                <div className='popup-text'>You need to select a type of loan.</div>
                                            </Grid>
                                            : null
                                        }


                                        <Grid item xs={12}>
                                            <Button
                                                variant='contained'
                                                color='secondary'
                                                onClick={() => {
                                                    if (this.state.productType) {
                                                        this.setState({
                                                            prerequisitesOpen: false
                                                        })
                                                    } else {
                                                        this.setState({
                                                            needProductType: true
                                                        })
                                                    }
                                                }}
                                            >
                                                <div className='white-text'>Let's go</div>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Fade>
                            </Modal>

                            {
                                this.props.userIsAdsum ?
                                <Tooltip title='Previous versions'>
                                    <Button
                                        className='button-icon'
                                        onClick={ async() => {
                                            await this.getPreviousVersions();
                                            this.setState({
                                                previousVersionsIsOpen: true
                                            })
                                        }}
                                    >
                                        <i className='fas fa-calendar' />
                                    </Button>
                                </Tooltip>
                                : null
                            }

                            {
                                this.props.userIsAdsum ?
                                <Modal
                                    open={this.state.previousVersionsIsOpen}
                                    onClose={() => {
                                        this.setState({ 'previousVersionsIsOpen': false })
                                    }
                                    }
                                    closeAfterTransition
                                    BackdropComponent={Backdrop}
                                >
                                    <Fade className='popup' id='popup-previous-versions' in={this.state.previousVersionsIsOpen}>
                                        <Grid container spacing={2} align='center' justifyContent='center'>

                                            <Grid item xs={6}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="input-label">Adsum Member</InputLabel>
                                                    <Select
                                                        value={this.state.previousVersionsAdsumMemberName}
                                                        onChange={(e) => {
                                                            var value = e.target.value;
                                                            this.setState({ previousVersionsAdsumMemberName: value})
                                                        }}
                                                    >
                                                    <MenuItem value='Mike'>Mike</MenuItem>
                                                    <MenuItem value='Daniel'>Daniel</MenuItem>
                                                    <MenuItem value='Shreeya'>Shreeya</MenuItem>
                                                    <MenuItem value='Freddie'>Freddie</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={9}>
                                            </Grid>

                                            <Grid item xs={12}>
                                                {this.renderPreviousVersions()}
                                            </Grid>
                                        </Grid>												
                                    </Fade>
                                </Modal>
                                : null
                            }

                            {
                                this.state.securityIsOpen ?
                                <Modal
                                    open={this.state.securityIsOpen}
                                    onClose={() => {
                                        this.setState({ 'securityIsOpen': false })
                                    }}
                                    closeAfterTransition
                                    BackdropComponent={Backdrop}
                                >
                                    <Fade className='popup popup-gui-security' in={this.state.securityIsOpen}>
                                        <Grid container spacing={2}>

                                            {
                                                this.state.canHaveChargeOnProperty ?
                                                <Grid item xs={12} className='popup-text'>
                                                    <strong>First Charge</strong> - Adsum will have a charge on the property only.
                                                </Grid>
                                                : null
                                            }

                                            {
                                                this.state.canHaveChargeOnProperty ?
                                                <Grid item xs={12} className='popup-text'>
                                                    <strong>Second Charge</strong> - A lender will have a charge on the property Adsum will hold a 2nd charge.
                                                </Grid>
                                                : null
                                            }

                                            {
                                                this.state.canHaveChargeOnProperty ?
                                                <Grid item xs={12} className='popup-text'>
                                                    <strong>Third Charge</strong> - A lender will have a first charge on the property and there will be a 2nd charge to another entity and Adsum will take 3rd Charge.
                                                </Grid>
                                                : null
                                            }

                                            <Grid item xs={12} className='popup-text'>
                                                <strong>Personal Guarantee</strong> - A Personal Guarantee is legally binding document signed by a Director or Personal of Significant Control to guarantee a loan for their business. An individual providing a Personal Guarantee must have Independent Legal Advice as they sign this in their personal capacity and as such, liability may fall on them.
                                            </Grid>

                                            <Grid item xs={12} className='popup-text'>
                                                <strong>Debenture</strong> - A debenture is an instrument used by a lender which enables it to secure loan repayments against the borrower’s assets – even if they default on the payment. It is filed on Companies House as a charge on the Borrower. 
                                            </Grid>

                                        </Grid>												
                                    </Fade>
                                </Modal>
                                : null
                            }

                        </Grid>
                    </Grid>

                    <Grid container spacing={6} align='center' justifyContent='center'>

                        <Grid item xs={12} sm={6}>
                            <div className='generator-items-zone'>
                                {this.renderStepper()}
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <div className='generator-items-zone ts-zone'>
                                <TS pdfData={pdfData} />
                            </div>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} align='center' justifyContent='center'>

                        <Grid item xs={12}>

                            <Modal
                                open={this.state.fillingNeeded}
                                onClose={() => {
                                    this.setState({ fillingNeeded: false })
                                }}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                            >
                                <Fade className='popup popup-gui' in={this.state.fillingNeeded}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <div className='popup-text'>We have found a few issues with the data you entered, can you check it?</div>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <List disablePadding={true} dense={true}>
                                                {this.state.fillingNeededMsgs.map((element, index) => (
                                                    <ListItem className='popup-text' key={index}>{element}</ListItem>
                                                ))}
                                            </List>
                                            <List>
                                            </List>
                                        </Grid>
                                    </Grid>
                                </Fade>
                            </Modal>

                            <Modal
                                open={this.state.fileNamePopUpIsOpen}
                                onClose={() => {
                                    this.setState({ fileNamePopUpIsOpen: false })
                                }}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                            >
                                <Fade className='popup popup-gui' in={this.state.fileNamePopUpIsOpen}>
                                    <Grid container spacing={2} align='center' justifyContent='center'>

                                        {
                                            this.state.action == 'email' ?
                                            <Grid item xs={12}>
                                                <div className='popup-text'>{emailPopUpText}</div>
                                            </Grid>
                                            : null
                                        }

                                        <Grid item xs={12}>
                                            {this.renderFileNameForm()}
                                        </Grid>

                                        {
                                            this.props.userIsAdsum && this.state.fileExists ?
                                                <Grid item xs={12}>
                                                    <div className='popup-text'>This file already exists, do you want to overwrite?</div>
                                                </Grid>
                                                : null
                                        }

                                        <Grid item xs={12}>
                                            <Button
                                                variant='contained'
                                                color='secondary'
                                                onClick={async () => {
                                                    if (this.props.userIsAdsum) {
                                                        var dataCanBeSent = await this.checkFileName()
                                                        if (dataCanBeSent) {
                                                            this.sendDataToBackEnd(pdfData, dbData)
                                                        }
                                                    } else {
                                                        this.sendDataToBackEnd(pdfData, dbData)
                                                    }

                                                }}
                                            >
                                                <div className='white-text'>{
                                                    this.props.userIsAdsum ?
                                                        this.state.fileExists ? 
                                                        'Overwrite' : 
                                                        this.state.action == 'email' ? 'Send' : 'Download'
                                                    : this.state.action == 'email' ? 'Send' : 'Download'
                                                }</div>
                                            </Button>
                                        </Grid>
                                    </Grid>

                                </Fade>
                            </Modal>
                            
                            <Modal
                                open={this.state.actionPerformed}
                                onClose={() => {
                                    this.setState({ actionPerformed: false })
                                }}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                            >
                                <Fade className='popup popup-gui' in={this.state.actionPerformed}>
                                    <Grid container spacing={2} align='center' justifyContent='center'>
                                        <Grid item xs={12}>
                                            <div className='popup-text'>{
                                                this.state.action == 'email' ?
                                                "Your termsheet is on its way, check your inbox in the next 3 minutes!":
                                                "Your Termsheet is almost ready... Give it a few seconds to appear in your downloads folder"
                                            }</div>
                                        </Grid>
                                    </Grid>
                                </Fade>
                            </Modal>

                        </Grid>

                        <Grid item xs={9} align='left'>
                            <Button
                                variant='contained'
                                color='secondary'
                                onClick={ ()=> {
                                    this.setState({ action: 'email'});
                                    this.checkActionRequired(loanAmount)
                                }}
                            >
                                <div className='white-text'>Send by email</div>
                            </Button>
                            <Tooltip title='Want to see it before sending it? Just download.'>
                                <Button
                                    id='download-button'
                                    className='button-icon'
                                    onClick={async () => {
                                        await this.setState({ action: 'download'});
                                        this.checkActionRequired(loanAmount)
                                    }}
                                >
                                    <i className='fas fa-download' />
                                </Button>
                            </Tooltip>
                        </Grid>

                    </Grid>

                </ThemeProvider>
            </div>
        );
    }
}