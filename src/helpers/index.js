import rp from 'request-promise';

function containsURL(str) {
  return new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(str);
}

function sanitizeData(messages) {
  return messages.reduce((arr, { text, attachments }) => {
    if (attachments) {
      arr.push({
        text,
        link_title: attachments[0].title,
        link_url: attachments[0].title_link,
        link_text: attachments[0].text,
        fallback: attachments[0].fallback,
        service_icon: attachments[0].service_icon,
        thumb_url: attachments[0].thumb_url,
      });
    } else if (containsURL(text)) {
      const isMatch = text.match(/<(.*)>/);
      if (isMatch) {
        const url = isMatch.pop();
        console.log('-------');
        console.log(text);
        console.log(url);
        arr.push({
          text,
          link_title: url,
          link_url: url,
          link_text: '',
          fallback: '',
          service_icon: '',
          thumb_url: '',
        });
      }
    }
    return arr;
  }, []);
}

function requestMsgs(ts = 'now') {
  return rp({
    method: 'GET',
    uri: 'https://slack.com/api/channels.history',
    qs: {
      token: process.env.REACT_APP_BOT_TOKEN,
      channel: 'C5ZSSSJEM',
      pretty: 1,
      count: 1000,
      latest: ts,
    },
    json: true,
  });
}

async function executeFetch() {
  let raw_data = [];
  let ts = null;
  let continue_loop = true;

  while (continue_loop) {
    /* eslint-disable */
    const { has_more, messages } = await requestMsgs(ts);
    /* eslint-enable */

    raw_data = raw_data.concat(messages);
    continue_loop = has_more;

    // https://stackoverflow.com/questions/48714689/javascript-re-assign-let-variable-with-destructuring
    ({ ts } = messages[messages.length - 1]);
  }

  const results = sanitizeData(raw_data);

  return results;
}

export default executeFetch;
