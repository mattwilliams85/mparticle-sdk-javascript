var TestsCore = require('./tests-core'),
    apiKey = TestsCore.apiKey,
    MockForwarder = TestsCore.MockForwarder;

describe('mParticleUser', function() {
    it('should call forwarder onUserIdentified method with a filtered user identity list', function(done) {
        mParticle.reset();
        var mockForwarder = new MockForwarder();

        mParticle.addForwarder(mockForwarder);

        var forwarder = {
            name: 'MockForwarder',
            settings: {},
            eventNameFilters: [],
            eventTypeFilters: [],
            attributeFilters: [],
            screenNameFilters: [],
            pageViewAttributeFilters: [],
            userIdentityFilters: [4],
            userAttributeFilters: [],
            moduleId: 1,
            isDebug: false,
            HasDebugString: 'false',
            isVisible: true
        };

        mParticle.configureForwarder(forwarder);

        mParticle.init(apiKey);

        var userIdentityRequest = {
            userIdentities: {
                google: 'test',
                customerid: 'id1',
                other: 'id2'
            }
        };

        mParticle.Identity.login(userIdentityRequest);

        mockForwarder.instance.onUserIdentifiedUser.getUserIdentities().userIdentities.should.not.have.property('google');
        mockForwarder.instance.onUserIdentifiedUser.getUserIdentities().userIdentities.should.have.property('customerid', 'id1');
        mockForwarder.instance.onUserIdentifiedUser.getUserIdentities().userIdentities.should.have.property('other', 'id2');

        done();
    });

    it('should call forwarder onUserIdentified method with a filtered user attributes list', function(done) {
        mParticle.reset();
        var mockForwarder = new MockForwarder();

        mParticle.addForwarder(mockForwarder);
        mParticle.configureForwarder({
            name: 'MockForwarder',
            settings: {},
            eventNameFilters: [],
            eventTypeFilters: [],
            attributeFilters: [],
            screenNameFilters: [],
            pageViewAttributeFilters: [],
            userIdentityFilters: [],
            userAttributeFilters: [mParticle.generateHash('gender')],
            moduleId: 1,
            isDebug: false,
            HasDebugString: 'false',
            isVisible: true
        });

        mParticle.init(apiKey);


        var userIdentityRequest = {
            userIdentities: {
                google: 'test',
                customerid: 'id1',
                other: 'id2'
            }
        };

        mParticle.Identity.login(userIdentityRequest);
        mParticle.Identity.getCurrentUser().setUserAttribute('gender', 'male');
        mParticle.Identity.getCurrentUser().setUserAttribute('color', 'blue');
        mParticle.Identity.login(userIdentityRequest);
        mockForwarder.instance.onUserIdentifiedUser.getAllUserAttributes().should.not.have.property('gender');
        mockForwarder.instance.onUserIdentifiedUser.getAllUserAttributes().should.have.property('color', 'blue');

        done();
    });
});
