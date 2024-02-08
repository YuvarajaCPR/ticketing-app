/*************************************************
 * AggMaps
 * @exports
 * PrivacyPolicyScreen.tsx
 * Created by Subashree on 27/09/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/

// imports
import {
  View,
  TouchableOpacity, Text, StyleSheet, Image
} from "react-native";
import React, { FC } from "react";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { getScaleAxis } from "../../Utils/Utility";

const PrivacyPolicyScreen: FC = () => {
  const navigation: any = useNavigation();

  const html = `<h1>Privacy Notice</h1>
    <div><span><span><span><span data-bs-custom-class="subtitle">Last updated&nbsp;July 21, 2022</span></span></span></span></div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">This privacy notice for&nbsp;AggMaps, LLC&nbsp;("<span>Company</span>," "<span>we</span>," "<span>us</span>," or "<span>our</span>"</span><span data-bs-custom-class="body_text">), describes how and why we might collect, store, use, and/or share ("<span>process</span>") your information when you use our services ("<span>Services</span>"), such as when you:</span></span></span></div>
    <ul>
    <li><span>Visit our website&nbsp;at&nbsp;<a href="http://www.aggmaps.com/" target="_blank" data-bs-custom-class="link">http://www.aggmaps.com</a><span><span><span data-bs-custom-class="body_text"><span><span>, or any website of ours that links to this privacy notice</span></span></span></span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">Download and use&nbsp;our mobile application&nbsp;(AggMaps)<span><span><span data-bs-custom-class="body_text"><span><span><span data-bs-custom-class="body_text"><span><span>,</span></span></span></span></span></span></span></span></span><span data-bs-custom-class="body_text"><span><span><span data-bs-custom-class="body_text"><span><span>&nbsp;or any other application of ours that links to this privacy notice</span></span></span></span></span></span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">Engage with us in other related ways, including any sales, marketing, or events</span></span></span></li>
    </ul>
    <div><span><span>Questions or concerns?&nbsp;</span>Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at&nbsp;info@aggmaps.com.</span></div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span>SUMMARY OF KEY POINTS</span></div>
    <div>&nbsp;</div>
    <div><span><span data-bs-custom-class="body_text"><span><em>This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for. You can also click&nbsp;</em></span></span></span><a href="https://aggmaps.com/privacy#toc" data-bs-custom-class="link"><span><span data-bs-custom-class="body_text"><span><em>here</em></span></span></span></a><span><span data-bs-custom-class="body_text"><span><em>&nbsp;to go directly to our table of contents.</em></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span>What personal information do we process?</span>&nbsp;When you visit, use, or navigate our Services, we may process personal information depending on how you interact with&nbsp;AggMaps, LLC&nbsp;and the Services, the choices you make, and the products and features you use. Click&nbsp;</span><a href="https://aggmaps.com/privacy#personalinfo" data-bs-custom-class="link">here</a><span>&nbsp;to learn more.</span></div>
    <div>&nbsp;</div>
    <div><span><span>Do we process any sensitive personal information?</span>&nbsp;We do not process sensitive personal information.</span></div>
    <div>&nbsp;</div>
    <div><span><span>Do we receive any information from third parties?</span>&nbsp;We do not receive any information from third parties.</span></div>
    <div>&nbsp;</div>
    <div><span><span>How do we process your information?</span>&nbsp;We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Click&nbsp;</span><a href="https://aggmaps.com/privacy#infouse" data-bs-custom-class="link">here</a><span>&nbsp;to learn more.</span></div>
    <div>&nbsp;</div>
    <div><span><span>In what situations and with which&nbsp;types of&nbsp;parties do we share personal information?</span>&nbsp;We may share information in specific situations and with specific&nbsp;categories of&nbsp;third parties. Click&nbsp;</span><a href="https://aggmaps.com/privacy#whoshare" data-bs-custom-class="link">here</a><span>&nbsp;to learn more.</span></div>
    <div>&nbsp;</div>
    <div><span><span>How do we keep your information safe?</span>&nbsp;We have&nbsp;organizational&nbsp;and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other&nbsp;unauthorized&nbsp;third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Click&nbsp;</span><a href="https://aggmaps.com/privacy#infosafe" data-bs-custom-class="link">here</a><span>&nbsp;to learn more.</span></div>
    <div>&nbsp;</div>
    <div><span><span>What are your rights?</span>&nbsp;Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Click&nbsp;</span><a href="https://aggmaps.com/privacy#privacyrights" data-bs-custom-class="link">here</a><span>&nbsp;to learn more.</span></div>
    <div>&nbsp;</div>
    <div><span><span>How do you exercise your rights?</span>&nbsp;The easiest way to exercise your rights is by filling out our data subject request form available&nbsp;here:&nbsp;<a href="http://www.aggmaps.com/data-request" target="_blank" data-bs-custom-class="link">http://www.aggmaps.com/data-request</a>, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.</span></div>
    <div>&nbsp;</div>
    <div><span>Want to learn more about what&nbsp;AggMaps, LLC&nbsp;does with any information we collect? Click&nbsp;</span><a href="https://aggmaps.com/privacy#toc" data-bs-custom-class="link">here</a><span>&nbsp;to review the notice in full.</span></div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div id="toc"><span><span><span><span>TABLE OF CONTENTS</span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><a href="https://aggmaps.com/privacy#infocollect" data-bs-custom-class="link">1. WHAT INFORMATION DO WE COLLECT?</a></span></div>
    <div><span><a href="https://aggmaps.com/privacy#infouse" data-bs-custom-class="link">2. HOW DO WE PROCESS YOUR INFORMATION?</a></span></div>
    <div><span><a href="https://aggmaps.com/privacy#legalbases" data-bs-custom-class="link">3.&nbsp;<span><span>WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</span></span></a></span></div>
    <div><span><span><a href="https://aggmaps.com/privacy#whoshare" data-bs-custom-class="link">4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></span></span></div>
    <div><span><a href="https://aggmaps.com/privacy#3pwebsites"><span data-bs-custom-class="link">5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?</span></a></span></div>
    <div><span><a href="https://aggmaps.com/privacy#cookies" data-bs-custom-class="link"><span>6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</span></a></span></div>
    <div><span><a href="https://aggmaps.com/privacy#sociallogins" data-bs-custom-class="link"><span><span><span>7. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</span></span></span></a></span></div>
    <div><span><a href="https://aggmaps.com/privacy#inforetain" data-bs-custom-class="link"><span>8. HOW LONG DO WE KEEP YOUR INFORMATION?</span></a></span></div>
    <div><span><a href="https://aggmaps.com/privacy#infosafe" data-bs-custom-class="link"><span>9. HOW DO WE KEEP YOUR INFORMATION SAFE?</span></a></span></div>
    <div><span><a href="https://aggmaps.com/privacy#infominors" data-bs-custom-class="link"><span>10. DO WE COLLECT INFORMATION FROM MINORS?</span></a></span></div>
    <div><span><span><a href="https://aggmaps.com/privacy#privacyrights" data-bs-custom-class="link">11. WHAT ARE YOUR PRIVACY RIGHTS?</a></span></span></div>
    <div><span><a href="https://aggmaps.com/privacy#DNT" data-bs-custom-class="link">12. CONTROLS FOR DO-NOT-TRACK FEATURES</a></span></div>
    <div><span><a href="https://aggmaps.com/privacy#caresidents" data-bs-custom-class="link">13. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</a></span></div>
    <div><span><a href="https://aggmaps.com/privacy#policyupdates" data-bs-custom-class="link">14. DO WE MAKE UPDATES TO THIS NOTICE?</a></span></div>
    <div><a href="https://aggmaps.com/privacy#contact" data-bs-custom-class="link">15. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a></div>
    <div><a href="https://aggmaps.com/privacy#request" data-bs-custom-class="link">16. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a></div>
    <div>&nbsp;</div>
    <div id="infocollect"><span><span><span><span><span id="control"><span>1. WHAT INFORMATION DO WE COLLECT?</span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div id="personalinfo"><span data-bs-custom-class="heading_2"><span><span>Personal information you disclose to us</span></span></span></div>
    <div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span><span><span data-bs-custom-class="body_text"><span><em>In Short:</em></span></span></span></span></span><span data-bs-custom-class="body_text"><span><span><span data-bs-custom-class="body_text"><span><em>&nbsp;</em></span><em>We collect personal information that you provide to us.</em></span></span></span></span></span></span></div>
    </div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">We collect personal information that you voluntarily provide to us when you&nbsp;register on the Services,&nbsp;</span><span><span data-bs-custom-class="body_text">express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</span></span></span></span></div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span>Personal Information Provided by You.</span>&nbsp;The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</span></span></span></div>
    <ul>
    <li><span>names</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>phone numbers</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>email addresses</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>usernames</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>passwords</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>contact preferences</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>contact or authentication data</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>billing addresses</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>debit/credit card numbers</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>job titles</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>mailing addresses</span></li>
    </ul>
    <div>&nbsp;</div>
    <div id="sensitiveinfo"><span><span>Sensitive Information.</span>&nbsp;We do not process sensitive information.</span></div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span><span>Payment Data.</span>&nbsp;We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument. All payment data is stored by&nbsp;Stripe<span><span><span data-bs-custom-class="body_text">. You may find their privacy notice link(s) here:&nbsp;<a href="https://stripe.com/privacy" target="_blank" data-bs-custom-class="link">https://stripe.com/privacy</a><span><span><span data-bs-custom-class="body_text"><span><span data-bs-custom-class="body_text">.</span></span></span></span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span><span>Social Media Login Data.&nbsp;</span>We may provide you with the option to register with us using your existing social media account details, like your Facebook, Twitter, or other social media account. If you choose to register in this way, we will collect the information described in the section called&nbsp;"<span><span data-bs-custom-class="body_text"><span><span><a href="https://aggmaps.com/privacy#sociallogins" data-bs-custom-class="link">HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a></span></span></span></span>"&nbsp;below.</span></div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span data-bs-custom-class="body_text"><span>Application Data.</span>&nbsp;If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:</span></div>
    <ul>
    <li><span data-bs-custom-class="body_text"><em>Geolocation Information.</em>&nbsp;We may request access or permission to track location-based information from your mobile device, either continuously or while you are using our mobile application(s), to provide certain location-based services. If you wish to change our access or permissions, you may do so in your device's settings.</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><em>Mobile Device Access.</em>&nbsp;We may request access or permission to certain features from your mobile device, including your mobile device's&nbsp;camera,&nbsp;bluetooth,&nbsp;calendar,&nbsp;contacts,&nbsp;microphone,&nbsp;reminders,&nbsp;sensors,&nbsp;sms messages,&nbsp;social media accounts,&nbsp;storage,&nbsp;and other features. If you wish to change our access or permissions, you may do so in your device's settings.</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><em>Mobile Device Data.</em>&nbsp;We automatically collect device information (such as your mobile device ID, model, and manufacturer), operating system, version information and system configuration information, device and application identification numbers, browser type and version, hardware model Internet service provider and/or mobile carrier, and Internet Protocol (IP) address (or proxy server). If you are using our application(s), we may also collect information about the phone network associated with your mobile device, your mobile device&rsquo;s operating system or platform, the type of mobile device you use, your mobile device&rsquo;s unique device ID, and information about the features of our application(s) you accessed.</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><em>Push Notifications.</em>&nbsp;We may request to send you push notifications regarding your account or certain features of the application(s). If you wish to opt out from receiving these types of communications, you may turn them off in your device's settings.</span></li>
    </ul>
    <div><span>This information is primarily needed to maintain the security and operation of our application(s), for troubleshooting, and for our internal analytics and reporting purposes.</span></div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span>All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</span></div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span data-bs-custom-class="heading_2"><span><span>Information automatically collected</span></span></span></div>
    <div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span><span><span data-bs-custom-class="body_text"><span><em>In Short:</em></span></span></span></span></span><span data-bs-custom-class="body_text"><span><span><span data-bs-custom-class="body_text"><span><em>&nbsp;</em></span><em>Some information &mdash; such as your Internet Protocol (IP) address and/or browser and device characteristics &mdash; is collected automatically when you visit our Services.</em></span></span></span></span></span></span></div>
    </div>
    <div>&nbsp;</div>
    <div><span>We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.</span></div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span>Like many businesses, we also collect information through cookies and similar technologies.</span></div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span>The information we collect includes:</span></div>
    <ul>
    <li><span><em>Log and Usage Data.</em>&nbsp;Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type, and settings and information about your activity in the Services<span>&nbsp;</span>(such as the date/time stamps associated with your usage, pages and files viewed, searches, and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called&nbsp;"crash dumps"), and hardware settings).</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text"><em>Device Data.</em>&nbsp;We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services. Depending on the device used, this device data may include information such as your IP address (or proxy server), device and application identification numbers, location, browser type, hardware model, Internet service provider and/or mobile carrier, operating system, and system configuration information.</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text"><em>Location Data.</em>&nbsp;We collect location data such as information about your device's location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services.</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <div id="infouse"><span><span><span><span><span id="control"><span>2. HOW DO WE PROCESS YOUR INFORMATION?</span></span></span></span></span></span></div>
    <div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span><span><span data-bs-custom-class="body_text"><span><em>In Short:&nbsp;</em></span><em>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</em></span></span></span></span></span></span></div>
    </div>
    <div>&nbsp;</div>
    <div><span><span>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</span></span></div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text"><span>To facilitate account creation and authentication and otherwise manage user accounts.&nbsp;</span>We may process your information so you can create and log in to your account, as well as keep your account in working order.</span></span></span></li>
    </ul>
    <div>
    <div>
    <div>
    <div>
    <div>
    <div>
    <div>
    <div>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <ul>
    <li><span><span><span><span data-bs-custom-class="body_text"><span>To request feedback.&nbsp;</span>We may process your information when necessary to request feedback and to contact you about your use of our Services.</span></span></span></span></li>
    </ul>
    <div>
    <div>&nbsp;</div>
    <ul>
    <li><span><span>To send you marketing and promotional communications.&nbsp;</span>We may process the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can opt out of our marketing emails at any time. For more information, see&nbsp;"</span><a href="https://aggmaps.com/privacy#privacyrights" data-bs-custom-class="link">WHAT ARE YOUR PRIVACY RIGHTS?</a><span><span><span data-bs-custom-class="body_text">"&nbsp;below).</span></span></span></li>
    </ul>
    <div>
    <div>&nbsp;</div>
    <ul>
    <li><span><span data-bs-custom-class="body_text"><span>To deliver targeted advertising to you.</span>&nbsp;We may process your information to develop and display&nbsp;personalized&nbsp;content and advertising tailored to your interests, location, and more.</span></span></li>
    </ul>
    <div>
    <div>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text"><span>To protect our Services.</span>&nbsp;We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.</span></li>
    </ul>
    <div>
    <div>
    <div>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text"><span>To identify usage trends.</span>&nbsp;We may process information about how you use our Services to better understand how they are being used so we can improve them.</span></li>
    </ul>
    <div>
    <div>&nbsp;</div>
    <ul>
    <li><span><span>To determine the effectiveness of our marketing and promotional campaigns.</span>&nbsp;We may process your information to better understand how to provide marketing and promotional campaigns that are most relevant to you.</span></li>
    </ul>
    <div>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text"><span>To save or protect an individual's vital interest.</span>&nbsp;We may process your information when necessary to save or protect an individual&rsquo;s vital interest, such as to prevent harm.</span></li>
    </ul>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div id="legalbases"><span>3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?</span></div>
    <div>&nbsp;</div>
    <div><em><span>In Short:&nbsp;</span>We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e.,&nbsp;legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or&nbsp;fulfill&nbsp;our contractual obligations, to protect your rights, or to&nbsp;fulfill&nbsp;our legitimate business interests.</em></div>
    <div>&nbsp;</div>
    <div><em><span><span data-bs-custom-class="body_text"><span><span style="text-decoration: underline;">If you are located in the EU or UK, this section applies to you.</span></span></span></span></em></div>
    <div>&nbsp;</div>
    <div><span>The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:</span></div>
    <ul>
    <li><span><span>Consent.&nbsp;</span>We may process your information if you have given us permission (i.e.,&nbsp;consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Click&nbsp;</span><a href="https://aggmaps.com/privacy#withdrawconsent" data-bs-custom-class="link">here</a><span>&nbsp;to learn more.</span></li>
    </ul>
    <div>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text"><span>Legitimate Interests.</span>&nbsp;We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms. For example, we may process your personal information for some of the purposes described in order to:</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text">Send users information about special offers and discounts on our products and services</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text">Develop and display&nbsp;personalized&nbsp;and relevant advertising content for our users</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text">Analyze&nbsp;how our services are used so we can improve them to engage and retain users</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text">Support our marketing activities</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text">Diagnose problems and/or prevent fraudulent activities</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text">Understand how our users use our products and services so we can improve user experience</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text"><span>Legal Obligations.</span>&nbsp;We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.<br /></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text"><span>Vital Interests.</span>&nbsp;We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.</span></li>
    </ul>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span data-bs-custom-class="body_text"><span><span style="text-decoration: underline;"><em>If you are located in Canada, this section applies to you.</em></span></span></span></div>
    <div>&nbsp;</div>
    <div><span data-bs-custom-class="body_text">We may process your information if you have given us specific permission (i.e.,&nbsp;express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e.,&nbsp;implied consent). You can withdraw your consent at any time. Click&nbsp;</span><a href="https://aggmaps.com/privacy#withdrawconsent" data-bs-custom-class="link">here</a><span data-bs-custom-class="body_text">&nbsp;to learn more.</span></div>
    <div>&nbsp;</div>
    <div><span data-bs-custom-class="body_text">In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:</span></div>
    <ul>
    <li><span data-bs-custom-class="body_text">If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text">For investigations and fraud detection and prevention</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text">For business transactions provided certain conditions are met</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text">If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text">For identifying injured, ill, or deceased persons and communicating with next of kin</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text">If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text">If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text">If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>If the collection is solely for journalistic, artistic, or literary purposes</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span data-bs-custom-class="body_text">If the information is publicly available and is specified by the regulations</span></span></li>
    </ul>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div id="whoshare"><span><span><span><span><span id="control"><span>4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span><em>In Short:</em></span><em>&nbsp;We may share information in specific situations described in this section and/or with the following&nbsp;categories of&nbsp;third parties.</em></span></span></span></div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span><span>Vendors, Consultants, and Other Third-Party Service Providers.</span>&nbsp;We may share your data with third-party vendors, service providers, contractors, or agents ("<span>third parties</span>") who perform services for us or on our behalf and require access to such information to do that work.&nbsp;We have contracts in place with our third parties, which are designed to help safeguard your personal information. This means that they cannot do anything with your personal information unless we have instructed them to do it. They will also not share your personal information with any&nbsp;organization&nbsp;apart from us. They also commit to protect the data they hold on our behalf and to retain it for the period we instruct.&nbsp;The&nbsp;categories of&nbsp;third parties we may share personal information with are as follows:</span></div>
    <ul>
    <li><span>Communication &amp; Collaboration Tools</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Cloud Computing Services</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Finance &amp; Accounting Tools</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Government Entities</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Payment Processors</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Performance Monitoring Tools</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Product Engineering &amp; Design Tools</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Website Hosting Service Providers</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>User Account Registration &amp; Authentication Services</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Testing Tools</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Social Networks</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Sales &amp; Marketing Tools</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Retargeting Platforms</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text">Order&nbsp;Fulfillment&nbsp;Service Providers</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Data Storage Service Providers</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Ad Networks</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Affiliate Marketing Programs</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Data Analytics Services</span></li>
    </ul>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span>We&nbsp;also&nbsp;may need to share your personal information in the following situations:</span></div>
    <ul>
    <li><span><span>Business Transfers.</span>&nbsp;We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span>When we use Google Maps Platform APIs.</span>&nbsp;We may share your information with certain Google Maps Platform APIs (e.g.,&nbsp;Google Maps API, Places API). To find out more about Google&rsquo;s Privacy Policy, please refer to this&nbsp;</span><a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank" data-bs-custom-class="link">link</a><span>.&nbsp;We use certain Google Maps Platform APIs to retrieve certain information when you make location-specific requests. This includes:&nbsp;location;&nbsp;and other similar information. A full list of what we use information for can be found in this section and in the previous section titled&nbsp;"</span><a href="https://aggmaps.com/privacy#infouse" data-bs-custom-class="link">HOW DO WE PROCESS YOUR INFORMATION?</a><span>".&nbsp;We obtain and store on your device ("cache") your location. You may revoke your consent anytime by contacting us at the contact details provided at the end of this document.&nbsp;The Google Maps Platform APIs that we use store and access cookies and other information on your devices. If you are a user currently in the European Economic Area (EU countries, Iceland, Liechtenstein, and Norway) or the United Kingdom, please take a look at our Cookie Notice.</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span data-bs-custom-class="body_text"><span>Affiliates.&nbsp;</span>We may share your information with our affiliates, in which case we will require those affiliates to&nbsp;honor&nbsp;this privacy notice. Affiliates include our parent company and any subsidiaries, joint venture partners, or other companies that we control or that are under common control with us.</span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span data-bs-custom-class="body_text"><span>Business Partners.</span>&nbsp;We may share your information with our business partners to offer you certain products, services, or promotions.</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span>Other Users.</span>&nbsp;When you share personal information&nbsp;(for example, by posting comments, contributions, or other content to the Services)&nbsp;or otherwise interact with public areas of the Services, such personal information may be viewed by all users and may be publicly made available outside the Services in perpetuity.&nbsp;If you interact with other users of our Services and register for our Services through a social network (such as Facebook), your contacts on the social network will see your name, profile photo, and descriptions of your activity.&nbsp;Similarly, other users will be able to view descriptions of your activity, communicate with you within our Services, and view your profile.</span></li>
    </ul>
    <div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span>5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?</span></div>
    <div>&nbsp;</div>
    <div><span><span data-bs-custom-class="body_text"><span><em>In Short:</em></span><em>&nbsp;We are not responsible for the safety of any information that you share with third parties that we may link to or who advertise on our Services, but are not affiliated with, our Services.</em></span></span></div>
    <div>&nbsp;</div>
    <div><span>The Services&nbsp;may link to third-party websites, online services, or mobile applications and/or contain advertisements from third parties that are not affiliated with us and which may link to other websites, services, or applications. Accordingly, we do not make any guarantee regarding any such third parties, and we will not be liable for any loss or damage caused by the use of such third-party websites, services, or applications. The inclusion of a link towards a third-party website, service, or application does not imply an endorsement by us. We cannot guarantee the safety and privacy of data you provide to any third parties. Any data collected by third parties is not covered by this privacy notice. We are not responsible for the content or privacy and security practices and policies of any third parties, including other websites, services, or applications that may be linked to or from the Services. You should review the policies of such third parties and contact them directly to respond to your questions.</span></div>
    <div>&nbsp;</div>
    <div id="cookies"><span><span><span><span><span id="control"><span>6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span><em>In Short:</em></span><em>&nbsp;We may use cookies and other tracking technologies to collect and store your information.</em></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice<span><span data-bs-custom-class="body_text">.</span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div id="sociallogins"><span><span><span><span><span id="control"><span>7. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span><em>In Short:&nbsp;</em></span><em>If you choose to register or log in to our services using a social media account, we may have access to certain information about you.</em></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or Twitter logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.</span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">We will use the information we receive only for the purposes that are described in this privacy notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.</span></span></span></div>
    <div>&nbsp;</div>
    <div id="inforetain"><span><span><span><span><span id="control"><span>8. HOW LONG DO WE KEEP YOUR INFORMATION?</span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span><em>In Short:&nbsp;</em></span><em>We keep your information for as long as necessary to&nbsp;fulfill&nbsp;the purposes outlined in this privacy notice unless otherwise required by law.</em></span></span></span></div>
    <div>&nbsp;</div>
    <div><span>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than&nbsp;the period of time in which users have an account with us.</span></div>
    <div>&nbsp;</div>
    <div><span>When we have no ongoing legitimate business need to process your personal information, we will either delete or&nbsp;anonymize&nbsp;such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.</span></div>
    <div>&nbsp;</div>
    <div id="infosafe"><span><span><span><span><span id="control"><span>9. HOW DO WE KEEP YOUR INFORMATION SAFE?</span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span><em>In Short:&nbsp;</em></span><em>We aim to protect your personal information through a system of&nbsp;organizational&nbsp;and technical security measures.</em></span></span></span></div>
    <div>&nbsp;</div>
    <div><span>We have implemented appropriate and reasonable technical and&nbsp;organizational&nbsp;security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other&nbsp;unauthorized&nbsp;third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.</span></div>
    <div>&nbsp;</div>
    <div id="infominors"><span><span><span><span><span id="control"><span>10. DO WE COLLECT INFORMATION FROM MINORS?</span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span><em>In Short:</em></span><em>&nbsp;We do not knowingly collect data from or market to children under 18 years of age.</em></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent&rsquo;s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at&nbsp;<span><span data-bs-custom-class="body_text">info@aggmaps.com</span></span>.</span></span></span></div>
    <div>&nbsp;</div>
    <div id="privacyrights"><span><span><span><span><span id="control"><span>11. WHAT ARE YOUR PRIVACY RIGHTS?</span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span><em>In Short:</em></span><em>&nbsp;In some regions, such as&nbsp;the European Economic Area (EEA), United Kingdom (UK), and Canada, you have rights that allow you greater access to and control over your personal information.<span>&nbsp;</span>You may review, change, or terminate your account at any time.</em></span></span></span></div>
    <div>&nbsp;</div>
    <div><span>In some regions (like&nbsp;the EEA, UK, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section&nbsp;"</span><a href="https://aggmaps.com/privacy#contact" data-bs-custom-class="link">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a><span>"&nbsp;below.</span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">We will consider and act upon any request in accordance with applicable data protection laws.</span></span></span></div>
    <div><span>&nbsp;</span></div>
    <div><span>If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here:&nbsp;<span><span><span data-bs-custom-class="body_text"><span><span data-bs-custom-class="body_text"><a href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm" rel="noopener noreferrer" target="_blank" data-bs-custom-class="link"><span>https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm</span></a></span></span></span></span></span>.</span></div>
    <div>&nbsp;</div>
    <div><span>If you are located in Switzerland, the contact details for the data protection authorities are available here:&nbsp;<span><span><span data-bs-custom-class="body_text"><span><span data-bs-custom-class="body_text"><span><a href="https://www.edoeb.admin.ch/edoeb/en/home.html" rel="noopener noreferrer" target="_blank" data-bs-custom-class="link">https://www.edoeb.admin.ch/edoeb/en/home.html</a></span></span></span></span></span></span>.</span></div>
    <div>&nbsp;</div>
    <div id="withdrawconsent"><span><span><span style="text-decoration: underline;">Withdrawing your consent:</span></span>&nbsp;If we are relying on your consent to process your personal information,&nbsp;which may be express and/or implied consent depending on the applicable law,&nbsp;you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section&nbsp;"</span><a href="https://aggmaps.com/privacy#contact" data-bs-custom-class="link">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a><span>"&nbsp;below.</span></div>
    <div>&nbsp;</div>
    <div><span>However, please note that this will not affect the lawfulness of the processing before its withdrawal, nor&nbsp;when applicable law allows,&nbsp;will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.</span></div>
    <div>&nbsp;</div>
    <div><span><span><span style="text-decoration: underline;">Opting out of marketing and promotional communications:</span></span><span><span style="text-decoration: underline;">&nbsp;</span></span>You can unsubscribe from our marketing and promotional communications at any time by&nbsp;clicking on the unsubscribe link in the emails that we send,&nbsp;replying&nbsp;"STOP" or "UNSUBSCRIBE"&nbsp;to the SMS messages that we send,&nbsp;or by contacting us using the details provided in the section&nbsp;"</span><a href="https://aggmaps.com/privacy#contact" data-bs-custom-class="link">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a><span><span data-bs-custom-class="body_text">"&nbsp;below. You will then be removed from the marketing lists. However, we may still communicate with you &mdash; for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes.</span></span></div>
    <div>&nbsp;</div>
    <div><span><span data-bs-custom-class="heading_2"><span>Account Information</span></span></span></div>
    <div>&nbsp;</div>
    <div><span data-bs-custom-class="body_text">If you would at any time like to review or change the information in your account or terminate your account, you can:</span></div>
    <ul>
    <li><span data-bs-custom-class="body_text">Log in to your account settings and update your user account.</span></li>
    </ul>
    <div>&nbsp;</div>
    <div><span>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.</span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span><span style="text-decoration: underline;">Cookies and similar technologies:</span></span>&nbsp;Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services. To opt out of interest-based advertising by advertisers on our Services visit&nbsp;<span><span data-bs-custom-class="body_text"><a href="http://www.aboutads.info/choices/" rel="noopener noreferrer" target="_blank" data-bs-custom-class="link"><span>http://www.aboutads.info/choices/</span></a></span></span>.</span></span></span></div>
    <div>&nbsp;</div>
    <div><span data-bs-custom-class="body_text">If you have questions or comments about your privacy rights, you may email us at&nbsp;info@aggmaps.com.</span></div>
    <div>&nbsp;</div>
    <div id="DNT"><span><span><span><span><span id="control"><span>12. CONTROLS FOR DO-NOT-TRACK FEATURES</span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for&nbsp;recognizing&nbsp;and implementing DNT signals has been&nbsp;finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.</span></div>
    <div>&nbsp;</div>
    <div id="caresidents"><span><span><span><span><span id="control"><span>13. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span><em>In Short:&nbsp;</em></span><em>Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.</em></span></span></span></div>
    <div>&nbsp;</div>
    <div><span>California Civil Code Section 1798.83, also known as the&nbsp;"Shine The Light"&nbsp;law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.</span></div>
    <div>&nbsp;</div>
    <div><span>If you are under 18 years of age, reside in California, and have a registered account with Services, you have the right to request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g.,&nbsp;backups, etc.).</span></div>
    <div>&nbsp;</div>
    <div><span data-bs-custom-class="heading_2"><span><span>CCPA Privacy Notice</span></span></span></div>
    <div>
    <div>&nbsp;</div>
    <div><span>The California Code of Regulations defines a&nbsp;"resident"&nbsp;as:</span></div>
    </div>
    <div>&nbsp;</div>
    <div><span>(1) every individual who is in the State of California for other than a temporary or transitory purpose and</span></div>
    <div><span>(2) every individual who is domiciled in the State of California who is outside the State of California for a temporary or transitory purpose</span></div>
    <div>&nbsp;</div>
    <div><span>All other individuals are defined as&nbsp;"non-residents."</span></div>
    <div>&nbsp;</div>
    <div><span>If this definition of&nbsp;"resident"&nbsp;applies to you, we must adhere to certain rights and obligations regarding your personal information.</span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span>What categories of personal information do we collect?</span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">We have collected the following categories of personal information in the past twelve (12) months:</span></span></span></div>
    <div>&nbsp;</div>
    <table>
    <tbody>
    <tr>
    <td><span><span><span data-bs-custom-class="body_text"><span>Category</span></span></span></span></td>
    <td><span><span><span data-bs-custom-class="body_text"><span>Examples</span></span></span></span></td>
    <td><span><span><span data-bs-custom-class="body_text"><span>Collected</span></span></span></span></td>
    </tr>
    <tr>
    <td>
    <div><span>A. Identifiers</span></div>
    </td>
    <td>
    <div><span>Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name</span></div>
    </td>
    <td>
    <div>&nbsp;</div>
    <div data-bs-custom-class="body_text"><span data-bs-custom-class="body_text">YES</span></div>
    <div>&nbsp;</div>
    </td>
    </tr>
    <tr>
    <td>
    <div><span>B. Personal information categories listed in the California Customer Records statute</span></div>
    </td>
    <td>
    <div><span>Name, contact information, education, employment, employment history, and financial information</span></div>
    </td>
    <td>
    <div>&nbsp;</div>
    <div><span>YES</span></div>
    <div>&nbsp;</div>
    </td>
    </tr>
    <tr>
    <td>
    <div><span>C. Protected classification characteristics under California or federal law</span></div>
    </td>
    <td>
    <div><span>Gender and date of birth</span></div>
    </td>
    <td>
    <div>&nbsp;</div>
    <div data-bs-custom-class="body_text"><span data-bs-custom-class="body_text">YES</span></div>
    <div>&nbsp;</div>
    </td>
    </tr>
    <tr>
    <td>
    <div><span>D. Commercial information</span></div>
    </td>
    <td>
    <div><span>Transaction information, purchase history, financial details, and payment information</span></div>
    </td>
    <td>
    <div>&nbsp;</div>
    <div data-bs-custom-class="body_text"><span data-bs-custom-class="body_text">YES</span></div>
    <div>&nbsp;</div>
    </td>
    </tr>
    <tr>
    <td>
    <div><span>E. Biometric information</span></div>
    </td>
    <td>
    <div><span>Fingerprints and voiceprints</span></div>
    </td>
    <td>
    <div>&nbsp;</div>
    <div data-bs-custom-class="body_text">NO</div>
    <div>&nbsp;</div>
    </td>
    </tr>
    <tr>
    <td>
    <div><span>F. Internet or other similar network activity</span></div>
    </td>
    <td>
    <div><span>Browsing history, search history, online&nbsp;behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements</span></div>
    </td>
    <td>
    <div>&nbsp;</div>
    <div data-bs-custom-class="body_text"><span data-bs-custom-class="body_text">YES</span></div>
    <div>&nbsp;</div>
    </td>
    </tr>
    <tr>
    <td>
    <div><span>G. Geolocation data</span></div>
    </td>
    <td>
    <div><span>Device location</span></div>
    </td>
    <td>
    <div>&nbsp;</div>
    <div data-bs-custom-class="body_text"><span data-bs-custom-class="body_text">YES</span></div>
    <div>&nbsp;</div>
    </td>
    </tr>
    <tr>
    <td>
    <div><span>H. Audio, electronic, visual, thermal, olfactory, or similar information</span></div>
    </td>
    <td>
    <div><span>Images and audio, video or call recordings created in connection with our business activities</span></div>
    </td>
    <td>
    <div>&nbsp;</div>
    <div data-bs-custom-class="body_text">NO</div>
    <div>&nbsp;</div>
    </td>
    </tr>
    <tr>
    <td>
    <div><span>I. Professional or employment-related information</span></div>
    </td>
    <td>
    <div><span>Business contact details in order to provide you our services at a business level or job title, work history, and professional qualifications if you apply for a job with us</span></div>
    </td>
    <td>
    <div>&nbsp;</div>
    <div data-bs-custom-class="body_text"><span data-bs-custom-class="body_text">YES</span></div>
    <div>&nbsp;</div>
    </td>
    </tr>
    <tr>
    <td>
    <div><span>J. Education Information</span></div>
    </td>
    <td>
    <div><span>Student records and directory information</span></div>
    </td>
    <td>
    <div>&nbsp;</div>
    <div data-bs-custom-class="body_text">NO</div>
    <div>&nbsp;</div>
    </td>
    </tr>
    <tr>
    <td>
    <div><span>K. Inferences drawn from other personal information</span></div>
    </td>
    <td>
    <div><span>Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual&rsquo;s preferences and characteristics</span></div>
    </td>
    <td>
    <div>&nbsp;</div>
    <div data-bs-custom-class="body_text"><span>YES</span></div>
    <div>&nbsp;</div>
    </td>
    </tr>
    </tbody>
    </table>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">We may also collect other personal information outside of these categories instances where you interact with us in person, online, or by phone or mail in the context of:</span></span></span></div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">Receiving help through our customer support channels;</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">Participation in customer surveys or contests; and</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">Facilitation in the delivery of our Services and to respond to your inquiries.</span></span></span></li>
    </ul>
    <div><span><span><span data-bs-custom-class="body_text"><span>How do we use and share your personal information?</span></span></span></span></div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">AggMaps, LLC&nbsp;collects and shares your personal information through:</span></span></span></div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">Targeting cookies/Marketing cookies</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">Social media cookies</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">Beacons/Pixels/Tags</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">Click redirects:&nbsp;<span><span><span data-bs-custom-class="body_text"><span><span><span data-bs-custom-class="body_text"><span><span>Amazon affiliate link</span></span></span></span></span></span></span></span></span>.</span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>Social media plugins:&nbsp;"Twitter&rdquo; operated by Twitter, Inc.</span>&nbsp;<span>and&nbsp;<span><span><span data-bs-custom-class="body_text">"Facebook-I-Like" operated by Facebook Inc.</span></span></span><span><span><span data-bs-custom-class="body_text"><span><span><span data-bs-custom-class="body_text">. We use social media features, such as a&nbsp;"Like"&nbsp;button, and widgets, such as a&nbsp;"Share"&nbsp;button, in our Services. Such features may process your Internet Protocol (IP) address and track which page you are visiting on our website. We may place a cookie to enable the feature to work correctly. If you are logged in on a certain social media platform and you interact with a widget or button belonging to that social media platform, this information may be recorded to your profile of such social media platform. To avoid this, you should log out from that social media platform before accessing or using the Services. Social media features and widgets may be hosted by a third party or hosted directly on our Services. Your interactions with these features are governed by the privacy notices of the companies that provide them. By clicking on one of these buttons, you agree to the use of this plugin and consequently the transfer of personal information to the corresponding social media service. We have no control over the essence and extent of these transmitted data or their additional processing.</span></span></span></span></span></span></span></li>
    </ul>
    <div><span><span><span data-bs-custom-class="body_text"><span><span><span data-bs-custom-class="body_text">More information about our data collection and sharing practices can be found in this privacy notice.</span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">You may contact us&nbsp;by email at&nbsp;</span><span><span data-bs-custom-class="body_text">info@aggmaps.com,&nbsp;</span></span></span></span><span data-bs-custom-class="body_text">or by referring to the contact details at the bottom of this document.</span></div>
    <div>&nbsp;</div>
    <div><span>If you are using an&nbsp;authorized&nbsp;agent to exercise your right to opt out we may deny a request if the&nbsp;authorized&nbsp;agent does not submit proof that they have been validly&nbsp;authorized&nbsp;to act on your behalf.</span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span>Will your information be shared with anyone else?</span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span>We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Each service provider is a for-profit entity that processes the information on our behalf.</span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be&nbsp;"selling"&nbsp;of your personal information.</span></span></span></div>
    <div>&nbsp;</div>
    <div><span data-bs-custom-class="body_text">AggMaps, LLC&nbsp;has not sold any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months.&nbsp;</span>&nbsp;<span><span><span><span data-bs-custom-class="body_text">AggMaps, LLC</span><span data-bs-custom-class="body_text">&nbsp;has disclosed the following categories of personal information to third parties for a business or commercial purpose in the preceding twelve (12) months:</span></span></span></span>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <ul>
    <li><span><span><span><span data-bs-custom-class="body_text">Category B. Personal information, as defined in the California Customer Records law, such as your name, contact information, education, employment, employment history, and financial information.</span></span></span></span></li>
    </ul>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <div>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <div>
    <div>
    <div>
    <div>
    <div>
    <div><span>The categories of third parties to whom we disclosed personal information for a business or commercial purpose can be found under&nbsp;"<span><span><a href="https://aggmaps.com/privacy#whoshare" data-bs-custom-class="link">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a><span><span><span><span><span><span><span data-bs-custom-class="body_text"><span>"</span></span></span></span></span></span></span></span></span></span>.</span></div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span>Your rights with respect to your personal data</span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span style="text-decoration: underline;">Right to request deletion of the data &mdash; Request to delete</span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span>You can ask for the deletion of your personal information. If you ask us to delete your personal information, we will respect your request and delete your personal information, subject to certain exceptions provided by law, such as (but not limited to) the exercise by another consumer of his or her right to free speech, our compliance requirements resulting from a legal obligation, or any processing that may be required to protect against illegal activities.</span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span style="text-decoration: underline;">Right to be informed &mdash; Request to know</span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">Depending on the circumstances, you have a right to know:</span></span></span></div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">whether we collect and use your personal information;</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">the categories of personal information that we collect;</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">the purposes for which the collected personal information is used;</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">whether we sell your personal information to third parties;</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">the categories of personal information that we sold or disclosed for a business purpose;</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">the categories of third parties to whom the personal information was sold or disclosed for a business purpose; and</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">the business or commercial purpose for collecting or selling personal information.</span></span></span></li>
    </ul>
    <div><span>In accordance with applicable law, we are not obligated to provide or delete consumer information that is de-identified in response to a consumer request or to re-identify individual data to verify a consumer request.</span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span style="text-decoration: underline;">Right to Non-Discrimination for the Exercise of a Consumer&rsquo;s Privacy Rights</span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span>We will not discriminate against you if you exercise your privacy rights.</span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span style="text-decoration: underline;">Verification process</span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span>Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. These verification efforts require us to ask you to provide information so that we can match it with information you have previously provided us. For instance, depending on the type of request you submit, we may ask you to provide certain information so that we can match the information you provide with the information we already have on file, or we may contact you through a communication method (e.g.,&nbsp;phone or email) that you have previously provided to us. We may also use other verification methods as the circumstances dictate.</span></div>
    <div>&nbsp;</div>
    <div><span>We will only use personal information provided in your request to verify your identity or authority to make the request. To the extent possible, we will avoid requesting additional information from you for the purposes of verification. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes. We will delete such additionally provided information as soon as we finish verifying you.</span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span style="text-decoration: underline;">Other privacy rights</span></span></span></span></div>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">You may object to the processing of your personal information.</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">You may request correction of your personal data if it is incorrect or no longer relevant, or ask to restrict the processing of the information.</span></span></span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span>You can designate an&nbsp;authorized&nbsp;agent to make a request under the CCPA on your behalf. We may deny a request from an&nbsp;authorized&nbsp;agent that does not submit proof that they have been validly&nbsp;authorized&nbsp;to act on your behalf in accordance with the CCPA.</span></li>
    </ul>
    <div>&nbsp;</div>
    <ul>
    <li><span><span><span data-bs-custom-class="body_text">You may request to opt out from future selling of your personal information to third parties. Upon receiving an opt-out request, we will act upon the request as soon as feasibly possible, but no later than fifteen (15) days from the date of the request submission.</span></span></span></li>
    </ul>
    <div><span><span><span data-bs-custom-class="body_text">To exercise these rights, you can contact us&nbsp;</span><span><span data-bs-custom-class="body_text"><span><span data-bs-custom-class="body_text">by email at&nbsp;info@aggmaps.com,&nbsp;</span></span></span></span></span></span><span data-bs-custom-class="body_text">or by referring to the contact details at the bottom of this document. If you have a complaint about how we handle your data, we would like to hear from you.</span></div>
    <div>&nbsp;</div>
    <div id="policyupdates"><span><span><span><span><span id="control"><span>14. DO WE MAKE UPDATES TO THIS NOTICE?</span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><em><span>In Short:&nbsp;</span>Yes, we will update this notice as necessary to stay compliant with relevant laws.</em></span></span></span></div>
    <div>&nbsp;</div>
    <div><span>We may update this privacy notice from time to time. The updated version will be indicated by an updated&nbsp;"Revised"&nbsp;date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.</span></div>
    <div>&nbsp;</div>
    <div id="contact"><span><span><span><span><span id="control"><span>15. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">If you have questions or comments about this notice, you may&nbsp;contact our Data Protection Officer (DPO),&nbsp;<span><span data-bs-custom-class="body_text">Eric Dance</span></span>,<span><span><span data-bs-custom-class="body_text">&nbsp;by email at&nbsp;</span></span></span><span><span data-bs-custom-class="body_text">info@aggmaps.com</span></span>,</span>&nbsp;<span><span><span data-bs-custom-class="body_text">&nbsp;or by post to:</span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text"><span><span><span><span data-bs-custom-class="body_text">AggMaps, LLC</span></span></span></span></span></span></span></div>
    <div><span><span><span><span data-bs-custom-class="body_text">Eric Dance</span></span></span></span></div>
    <div><span><span><span><span data-bs-custom-class="body_text">721 111th St</span></span></span></span></div>
    <div><span data-bs-custom-class="body_text">Arlington<span><span data-bs-custom-class="body_text">,&nbsp;TX</span>&nbsp;76011</span></span></div>
    <div><span><span><span data-bs-custom-class="body_text">United States</span></span></span></div>
    <div>&nbsp;</div>
    <div id="request"><span><span><span><span><span id="control"><span>16. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</span></span></span></span></span></span></div>
    <div>&nbsp;</div>
    <div><span><span><span data-bs-custom-class="body_text">Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please&nbsp;</span><span data-bs-custom-class="body_text">visit:&nbsp;<a href="http://www.aggmaps.com/data-request" target="_blank" data-bs-custom-class="link">http://www.aggmaps.com/data-request</a></span></span><span data-bs-custom-class="body_text">.</span></span></div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>`;


    const privacyPolicyheader = () => {
      return (
        <View style={styles.container}>
            <TouchableOpacity
              style={styles.topImgContainer}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require("../../assets/imgBack.png")}
                style={styles.imgContainer}
              />
            </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={{ color: "black", fontSize: 20, fontWeight: "600" }}>
              {"Privacy Policy"}
            </Text>
          </View>
        </View>
      );
    };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {privacyPolicyheader()}

      <WebView
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        source={{ uri: 'https://aggmaps.com/privacy' }}
      />
    </View>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: getScaleAxis(72),
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  topImgContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: getScaleAxis(12),
    marginLeft: 10,
    width: 30,
    height: 30,
  },
  imgContainer: {
    marginLeft: 1,
    width: 30,
    height: 30,
  },
});