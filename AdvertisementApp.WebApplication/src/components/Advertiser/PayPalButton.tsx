import React, { Component } from "react";
import PaypalExpressBtn from "react-paypal-express-checkout";

interface IProps {
  amount: number;
  onSuccess: () => void;
}

class PayPalButton extends Component<IProps> {
  render() {
    const onSuccess = (payment: any) => {
      this.props.onSuccess();
    };

    const onCancel = (data: any) => {};

    const onError = (err: any) => {};

    let environment = "sandbox";
    let currency = "USD";

    const client = {
      sandbox:
        "AY4_DyBQW5D9ICLaMPTTuMYVllL7AR_4FIPxix-yFF1iM8RYcojatextShJxK_RV2YsJTXm8Gs_HWB_a",
      production: "YOUR-PRODUCTION-APP-ID"
    };
    return (
      <div>
        <PaypalExpressBtn
          env={environment}
          client={client}
          currency={currency}
          total={this.props.amount}
          onError={onError}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
        <form
          action="https://www.sandbox.paypal.com/cgi-bin/webscr"
          method="post"
        >
          <input type="hidden" name="cmd" value="_xclick-subscriptions" />
          <input
            type="hidden"
            name="business"
            value="pappkristof2-facilitator@gmail.com"
          />{" "}
          {/* Client ID or email */}
          <input
            type="hidden"
            name="item_name"
            value="Premium subscription"
          />{" "}
          {/* Subscription name */}
          <input
            type="image"
            name="submit"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribe_LG.gif"
          />{" "}
          {/* Button image */}
          <input type="hidden" name="a3" value="50.00"></input> {/* Amount */}
          <input type="hidden" name="p3" value="30"></input> {/* Length */}
          <input type="hidden" name="t3" value="D"></input> {/* Unit D-Days */}
          <input type="hidden" name="no_note" value="1"></input>{" "}
          {/* Required for subscription */}
          <input
            type="hidden"
            name="cancel_return"
            value="http://localhost:3000/subscription"
          />{" "}
          {/* Callback on cancel */}
          <input
            type="hidden"
            name="return"
            value="http://localhost:3000/subscription"
          />{" "}
          {/* Callback on success */}
        </form>
      </div>
    );
  }
}

export default PayPalButton;
