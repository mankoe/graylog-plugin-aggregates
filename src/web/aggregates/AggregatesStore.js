import Reflux from 'reflux';
import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';
import fetch from 'logic/rest/FetchProvider';

import AggregatesActions from './AggregatesActions';

const AggregatesStore = Reflux.createStore({
  listenables: [AggregatesActions],
  sourceUrl: '/plugins/org.graylog.plugins.aggregates/rules',
  rules: undefined,
  
  init() {
	  this.trigger({ rules: this.rules });
  },

  list() {
    const promise = fetch('GET', URLUtils.qualifyUrl(this.sourceUrl))
      .then(
        response => {
          this.rules = response.rules;
          this.trigger({ rules: this.rules });
          return this.rules;
        },
        error => {
          UserNotification.error(`Fetching aggregate rules failed with status: ${error}`,
            'Could not retrieve rules');
        });
    AggregatesActions.list.promise(promise);
  },
  create(newRule) {
	const url = URLUtils.qualifyUrl(this.sourceUrl);
	const method = 'PUT';
	
	const request = {
			rule: {
				name: newRule.name,
				query: newRule.query,
				field: newRule.field,
				numberOfMatches: newRule.numberOfMatches,
				matchMoreOrEqual: newRule.matchMoreOrEqual,
				interval: newRule.interval
			}	
	};

	const promise = fetch(method, url, request)
	  .then(() => {
	    UserNotification.success('Rule successfully created');
	    this.list();
	  }, (error) => {
	    UserNotification.error(`Creating rule failed with status: ${error.message}`,
	      'Could not create rule');
	  });

	AggregatesActions.create.promise(promise);
	
  },
  update(name, updatedRule) {
		const url = URLUtils.qualifyUrl(this.sourceUrl+'/' + name);
		const method = 'POST';
		
		const request = {
				rule: {
					name: updatedRule.name,
					query: updatedRule.query,
					field: updatedRule.field,
					numberOfMatches: updatedRule.numberOfMatches,
					matchMoreOrEqual: updatedRule.matchMoreOrEqual,
					interval: updatedRule.interval
				}	
		};

		const promise = fetch(method, url, request)
		  .then(() => {
		    UserNotification.success('Rule successfully updated');
		    this.list();
		  }, (error) => {
		    UserNotification.error(`Updating rule failed with status: ${error.message}`,
		      'Could not update rule');
		  });

		AggregatesActions.update.promise(promise);
		
	  },
  deleteByName(ruleName) {
	const url = URLUtils.qualifyUrl(this.sourceUrl + '/' + ruleName);
	const method = 'DELETE';
	//const request;
		
	const promise = fetch(method, url)
	  .then(() => {
		UserNotification.success('Rule successfully deleted');
		this.list();
	  }, (error) => {
		UserNotification.error(`Deleting rule failed with status: ${error.message}`,
		  'Could not delete rule');
	  });
	
    AggregatesActions.deleteByName.promise(promise);
  },
});

export default AggregatesStore;