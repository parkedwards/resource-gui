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
      });
    } else if (containsURL(text)) {
      const isMatch = text.match(/<(.*)>/);
      if (isMatch) {
        const url = isMatch.pop();
        arr.push({
          text,
          link_title: url,
          link_url: url,
          link_text: '',
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
      token: 'xoxb-310982979749-lhkEn4JGL9tRq81EFSw9TsRN',
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
