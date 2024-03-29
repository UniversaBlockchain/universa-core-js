import chai from 'chai';

import {
  Node,
  Network,
  Topology,
  encode64,
  decode64,
  PrivateKey,
  PublicKey
} from '../src/index';

// import {
//   encode64,
//   decode64,
//   PrivateKey,
//   PublicKey
// } from 'unicrypto';

const should = chai.should();

const keyBin = decode64("HhisGAUQuCAAuPpkMr8wf6f/jCb2p1+5xDwCU25f/m3Q7dh3R31OUfD+WvAtDga1aifgufNudMwZREU6yiqADUIEBsELX6kFEHn0hd5zsniIoGchIhMWeaQ+F2EzB7wkK742QoY4mlbJpCsNzc8ehr/MsD19a8Im0YdJ4t1gudvQE7h+tRrImh+CLIN4FpHtvT0ZNroDKnNCnimOPbfe0jFip3cnC6bGdEvvpkLVJwWs1OQa6kkPBrdCMI3NrTlk21qxMu/ySukeRhCGsSp+KprNWinUWrVqfKmWkrKdLLePlyY+HB6sQkIBmZ7PbVd3nejRiTGeswOR+ZTHOvE4t5afVq+dfmWFsNlEGCQvKmwUqxPIw+kw5IcUdZrat0DvsJ2rDS6LwlnaNBLoEd7EgaPcI3lvjwuQ8XjCBQ05YrHwegTkLv6djqwfooS6ip4wCMmwPG1t294hP5BXcJ/i1uv2pkNdEQMacPbXjiPw0d5v0S02/VJv9oJ3NWLqtMhxgjFAhuKyzyz/0gqpQllW9zJrYQop3oNv1l6v0+FMo5ITfqB+NvuX5LjSYXimKLnj7BqwO4lVfOTaTehHaNGuBW4JqC5F3eRx1YWFmIM6VHlsXJ9KzmK9nSA1mDJe1v3GNq7bd8GDGsF89ROB2M44p8yN9tJnXIGn/pxB+7/2sB9suUcxgykkTePnnpIoo1AdoWppTG/qNtXDi0amhy3XwOg0kDQg60JNW4mo5did7Z6vkTPufi9yFcW+H3s9JB1IssbETopHDJ80Vl+xYAozLvEKxbectXw");
const keyPassword = "81bf60af-703c-4c28-8fc7-878860089df5";
const approvedId = decode64("dXFhEhoVw8G9QI1I4TnLJJxfgp2O+E+tddXY89u2/ZiFntd108MjIN1554GkSsS5kGVPW0nRjG/B2qI0JRm+Y6F7PPGB23vN3Tm55VnKung5OAijgsypuT/OL33lyUze");
const packedTopology = JSON.parse('{"list":[{"number":1,"domain_urls":["https://node-1-com.utoken.io:8080"],"name":"node-1-com.utoken.io","direct_urls":["http://188.42.130.44:8080"],"key":"HggcAQABxAABoJHPqusDZXM/24+65xno0cagoe/0+EvMZ96lPxPtEFVbcgy3D2smKFVNhPFjZoBe+GxqUQEPsb4YY3T8ovUFVUBPYv8dwXGlahnpXiKPJvlTsOrTyK/jUuDNEI64MvtON2+/8EbF02B5jWF4zY276GLfUoSE/h+PLKo49fXHV/uVe73P/4fONqt8NQFKNXU/y2izFHt1TSY7H3PywZqY9o+0y2lwi+cNPHnB1ZCCur5uqgnR81ZEaejNFz1Xa5+B2OOChOT8VFFtu4vVAFxuigX9sPoz2/EXF/9H6/8k7+mxc+BVW8WH6A7yCMGaBowJRo8i6FBchAl88776edXJow=="},{"number":2,"domain_urls":["https://node-2-com.utoken.io:8080"],"name":"node-2-com.utoken.io","direct_urls":["http://188.42.130.100:8080"],"key":"HggcAQABxAABlBTsd5kGqDGrjPs3gsefSQdcv4Wbg3+C3Jt3AQo7WLJslHwYVRJOjH103dsbHG3mT+EoRNZ9IVBn9GQRizYtHjFCldLfI+rt7EhuXsdGI59XszyFNbBf0CgW111lqoWlbULf/K3wjUtQ8IEtltmaQ63ZyAg5X2j0gvO2Pl9tt8sS53ejLB5EfuPhoUURqnA8D0H+5FATEADAWQe4mDGuSnwl2QdVGgGkzhyOcKf6CH+s+BrsEW+DTkC6jz6RMFLnYi2t8H9wDm04Dkbd5PLbkGn6Ywr4PGu7h5zSIhJ4UJLBbOmltKlHyHDXZSDP/nINeaQMDpnhE77Z6xVqGARQ4w=="},{"number":3,"domain_urls":["https://node-3-com.utoken.io:8080"],"name":"node-3-com.utoken.io","direct_urls":["http://188.42.130.156:8080"],"key":"HggcAQABxAABwlGPo66xnb+U12nCJMt1YsA9DDfUntYPyZQH67zrgjTFiL1ZwXMuynquwNK0QXHseYFR+5WRGvXM0J09O/M50jXytfWEE9j1pZGypYd011O/snbGtKEV+S5hiPjGB/JGtTwiCNipascJZ52EkCiwZFljofK+Px2l15rRK71Un2BSjAsb4Si0MLpxFt1iLdkq0MFXJVHCh4xmWiq3GPYsITsN/diCHblU32AA9hvnTEhvwolfZ3IC1ksohrOTCCl48AROJ5ZAk7YAtd4MHfKTwaXfCjfK3nZbwRL8BMSElLbx9y4NQwZ5MCaY6Q0PNUAO6mN2mOHOmVSbZr9t1F0ETQ=="},{"number":4,"domain_urls":["https://node-4-com.utoken.io:8080"],"name":"node-4-com.utoken.io","direct_urls":["http://188.42.130.172:8080"],"key":"HggcAQABxAAB07TWfunHzQT7l2uVKPbHvt/2b1dLHyK2j3WpQlI/NDtEHtFgBhcb0EE2YMM61oJElho8gfPZb6TUgWq8RoyA0EyAoHBPAbDu4+CYPm3HoIgvLDVs8ycgOtmmw6wf6TYJDubsTS+r9AooPED2Js2GIc85PGz9bKkdCcTrkuTsRe6dmCMMY2GL9tkD4ZEYoFRU6iVxQbL7qmRreaKIN2xhRbEfOl5w+4S/cCpJ1dx4ngwiax2iJtQDcJWNpOgqX8UzE8m83xxwAboL3itSUlvvU3Bvfn/LYxWJ2pG4XlW6YKMwblOq1V85GSOsRTee0I2Na1AI/3kusuGzy5ECBbNhlQ=="},{"number":5,"domain_urls":["https://node-5-com.utoken.io:8080"],"name":"node-5-com.utoken.io","direct_urls":["http://188.42.130.236:8080"],"key":"HggcAQABxAABtBIXp+RqbpBFtR2oY+bmJJWXytg0gf77WnrntbyQsxhhmS8WnoohBFn5IYzOd1poW4zDJM00MWZmV8VZdCrPp8jt3QCaay4axTT6XEc/JvARJ2KAkO0iQNKgsoPnZUVlO8DO1+X7R+8DkNnlXvld0xexyI0/yKDBGrK8bE0w4oets+4X9oFF1BW9WEvy11+/bc1vS9n8nvX9XCvKh6e+bRF71625fcCzsxap/vdCjDmNOsjjipn8l6BnCS/ygQjfBitqzD9mmu1kRlrQifpbs74UutwFgkGHjq3g7lrrNUikqPjg61XUIm5hfjnHmhJMEuFV5bGmJOVjL/ZYjDxWEQ=="},{"number":6,"domain_urls":["https://node-6-com.utoken.io:8080"],"name":"node-6-com.utoken.io","direct_urls":["http://188.42.131.28:8080"],"key":"HggcAQABxAAB2PGl3X3pXussqGHuI59lnxBlJ8njiolzhBrh3nuN6P8AWMWAr9Rlx11B3MrO9dIusWhp9JwGLiGJbKEL9CHIYuPkjpSmhe8wH+Rvik8Lma+haCM8pAUU74NK3mZ0QxmXsV9SYb2phenoQquArIfovR/erMsDvsVIVJlDPzvrqied/0quE5fJ7XvGuYlb7bAho6HOhMFdpGj3dZwYm5EIAYwXHUWeYVse+ZR8DcS5AKnk4Cz140zd2Rl+/uucfrkgiJet+LTx5YhfOKZ9kpjclw682eJnSswlBxJLBsloks8VBJf8dsSGaZxT29cRaRecAoTy9zpMjHPd4VBxpldDew=="},{"number":7,"domain_urls":["https://node-7-com.utoken.io:8080"],"name":"node-7-com.utoken.io","direct_urls":["http://188.42.131.188:8080"],"key":"HggcAQABxAAB4VjBNTN0zm9IzgGXAiqukvMphRxO3Eywf0Lqff4JfYDY3Nc3Jg5IjQID/vriCErumnxdQnOL0ci6uJpo6tgDGkvJ4uC7z3Sic+Tsoe6b1vmUSJcNEaBXlGH6kPaNkd2ZlTvBDZ/Iv1v2LwlMDHxK+NrPVHBhEXGguvz7u73fqpC9g3GPpThZwRG+X76YFoeK3P54iwwN127SB6GDV9hFp2XjuEvpLURT0+fnWgqfoFrfW0AMfA/7V6SRb8yF+P45ncOvi3sKJ6owK+/au2dlsHAIE+SCfIOg1iaQBKc3egBlliEZOK/9JSrIBrRxQfqvLCytnbYj7Fed2jmqa9IBaQ=="},{"number":8,"domain_urls":["https://node-8-com.utoken.io:8080"],"name":"node-8-com.utoken.io","direct_urls":["http://151.80.96.72:8080"],"key":"HggcAQABxAABnMPCqr/rXOHIYej+/BOniOOkreL0lWbCU7k1GmC3xM9zSSPxL5yZCcmhygttNq6AYoRAjROVAN7ioSF0tORYiqAzzT1GWe55KVFzRsAM6cOJmk0bfYySOiL5qLxjmqnbcCCHOIBkLUjVE8l6TSL284quuQ3iYtNmHdHvC6cb6lzDwqizIsGHaZpyp7A2N52saSUcVaZOPXrqTZP6bRjqOj5KEVqOwR3ZDtXkIUvXZtnrIkI/EoIhjvhv/oThRHdJOExFiPTfA7xqpuOZlK2PazKAwE2+46oaGk1oXEGnx4+XYhXGpArB6hAAhaUJxFxeNnJ2uXKmE6+M38pEQd28Uw=="},{"number":9,"domain_urls":["https://node-9-com.utoken.io:8080"],"name":"node-9-com.utoken.io","direct_urls":["http://151.80.101.56:8080"],"key":"HggcAQABxAABt9V2b1nxYGjgBGC03GI1JyG+T6w/QzgGW3GAtVGIQkzMhgpFJAmP+bk6ld4nN4qBjiP0m7oXRpsF/wEPR/BVl8SRtXSEhJ0YdNALg6muK8Qvi7o2mqpOFjlnH9hKbJk/we3je9etwsKcx2iXQN07lOXKr3eihSGIM9nIzxHCN2WAbGEX6v9AIxab1FkqIDdu5jq4DcFhP66SXHyU2U9Ryx9SU3MexvOWkfrQis3wlkGr9Oru4B6yaA3gKt9kekHzqZOjVv/Xp555bcH6OAo05TTgIJ74u1M24DR3LwqUNp50d5DusaxRxoneXTCwoCztNMLn4OXcjdT2Z+ePL+gOjw=="},{"number":10,"domain_urls":["https://node-10-com.utoken.io:8080"],"name":"node-10-com.utoken.io","direct_urls":["http://151.80.101.57:8080"],"key":"HggcAQABxAABtu8fYvlDoM4+aNKnGfVegXWatzrlWKEmFhtLIjIfmAuZaXnyQh64hl3VFrOysfuAXSiesKj/ODa5t0LiRe+y/dQi8Zv4X4aNUYQPzOmp6nOvkmfpsASastlKYspNvp2jhrUrNQh0h7Z01R7GGhAuttkDQjAGchCQ/MrqeYMM0PkE30HyRhpb9TGi5WsAH42kQgmFwMKskomTXr7jDc0uCFjkT3lMGwtSOn68qn7Uh0kvwUNdHYAJ0inGPx5O3N82zh6zQCP6Qxn8RWj56iVhk+iTmYjGHH4PiQve4JXFkaqaURt70gb3CynG2JzhEvZ/YB1bFDGBqoTBPjlNcGrBbw=="},{"number":11,"domain_urls":["https://node-11-com.utoken.io:8080"],"name":"node-11-com.utoken.io","direct_urls":["http://151.80.101.59:8080"],"key":"HggcAQABxAABtkdDZKMd4paOVghxEFWaSAP5JYD3UgcqM7ID7cBkIPc62zbwCm18WhoOR76y0g0jRf9W8NW5yjPLvqO9INs7weVK5MMSIQ2pX/glVCCLGwSdmr3vR3Jjp0ebCtwv4IxMtzQsljEUxJ3eQ7Ujwz81BwiqvEUs7hfOIoioq5y0UcG2NA8sRkLhotW4120aTmZfeEwBmCeXNlF3xTlsxvyiKv11tWB57oaESdeEB7EYml2Qz8KVzjjW96v9Nn3vARxdy3eJQQSoVdG1Igx/QyIu3n4m6/jH/eNxDHCDjUJ7XvU5ich8Xrol7W4p5QhjG1vQQ+fuuwG6ZZ1QFNQwEpRRoQ=="},{"number":12,"domain_urls":["https://node-12-com.utoken.io:8080"],"name":"node-12-com.utoken.io","direct_urls":["http://151.80.101.71:8080"],"key":"HggcAQABxAABsktlblyfP6g+7Rwcz6KVmBIXQQ8jQQ7i2OlDM5xX6nN6yiX53KVbHagfFaJmVGGrV8rN8k+JUfod2fqsL/v97NO0VweYvZ+qzgrqJy9yDTqLhpY/iY5A5qmGhRrY8tHt7jyoUzqDn62yNF6kb7aKNFBm8HnIDoZxRnJrzsNZvJjbLZ4NNa4iRUrA9z6S45+4ZYUlp/ioSaRfbwe+dFXhllunj/nFm8bo0ZS8bHHz4qaBLTDlsnmxjX5DjIxbhCXDTDEeH7xf0E+HJdYpKrA46fvygwO1gUVn+iOFJ2qWb0YkFTWQXanOX1j41mNbwnNBQArvR78zUHs04Gq+XT9tRQ=="},{"number":13,"domain_urls":["https://node-13-com.utoken.io:8080"],"name":"node-13-com.utoken.io","direct_urls":["http://54.38.69.39:8080"],"key":"HggcAQABxAABvl/mrut4HSTNhkk5LgqivUDaoNHigvZdWS55hdsuYzIEBuvnGId9ZYVS3T22lZldPVBPOlGnLKyPAIXKbhjvFs7p3WOxZN/gZFa+zNUEfjAVOEnz/fUMB74uA8/5kimdJm9opfc9X1buy/tVQypoAbGelDMI2ZN/55KqtHGNOjeam5UYIWGC/jWrnqcMjM3Q3xfARM+y3lOxhxh+LL6+0imuxSq4IMCMaZpb8dmzcziNIRf/gAn6uh3P7kJmK6RBHb374J5/TzBrNJ6VpMKyoZfTZB256KINhO/h+lfI0wO63gOfTnXQ7c29rcIp+GBpolqXWwH9qgOKf7xV0ZB5JQ=="},{"number":14,"domain_urls":["https://node-14-com.utoken.io:8080"],"name":"node-14-com.utoken.io","direct_urls":["http://54.38.69.40:8080"],"key":"HggcAQABxAABvrUMmpHvbG9jvUHGT9ZBL832x3vbh+xK21DSTAgmLu6872aoj37XGqoWxY6dXN0B+uQI50fZDhieOrDf+3qFEpKswQm5u1BLfUgsdx6BB2n4o9XDsGWU095/kyOPpXaSRzQDeVCCw0HrduwTkLLbrshDWdFmhEefCDPDHpj5gGjV0YBFTOxmgKygiTjvTjZEJrrVzX9fZYX1SXXFIaxeZiv/2+m1eDhb+y/LkJZta60F0pHXXGS1pXGuf1+9rOieMguMf+dpDOo5r2rDyWRKfGdIM/4eB8TsKesaVXNu2PovsQKtJhPwVqB/jGgeTaCqsGJV0yXsNWl3hHFlPOwqzw=="},{"number":15,"domain_urls":["https://node-15-com.utoken.io:8080"],"name":"node-15-com.utoken.io","direct_urls":["http://54.38.69.41:8080"],"key":"HggcAQABxAAByASdj9fl9BV6B+x0xsryRwJZ1UZ0LPnL6jS3BX/Zyk3navQsn+V09HRJ2DmRG8o2x9k7ufs20EBsZmgnKm9PuIPNoMs7B7Gy0AoE2xiUgbe6h214h3O68CswoZwDuh3BoVvKjb5k6lRNgnxhym6fbmQ//n6Zmlf3AmWeh67jNFBkvjORlpm+mRmVCLSZG/xLXl4CydwR+BMIiO8mjiMLy6nrXr+SxPWhg2C14lq3+89O+/lM9MbkF4+dF10e5GFQcqPR4eV3bBcqkU04ZBObytGhZRWdvHga4HLnYU9QPiBtBHsq9t5eWqfqSqnda24ts69313zjhfj4pPS/ZEl3mw=="},{"number":16,"domain_urls":["https://node-16-com.utoken.io:8080"],"name":"node-16-com.utoken.io","direct_urls":["http://54.38.69.42:8080"],"key":"HggcAQABxAABmJxAKlDxJVPzusG9ANDqZODf8seStH7OC18zGCIB/AP7IutXyjLmw/Q7qr0mWaPMkiY6aBRfQD7Fm4C7Kp7qTMmimjXFTSmfixHBpcr3E1I9LRQG4PtfjeiJj3WJfEFmVACW+F+2tK/majFUTmlZQhMw/Xqx7+vhDhmPXupyt5J1E2m4DOY5U3a00gso3ASD0yHceWuBtCRuZFLvxTkSGWvLzNEPPxxwhsjKQWNOqd2533SQokk9nl8HtMwpt5v0gt1eG1P8lxHKnh/2M1CgDAeni6UGg8Tdvz+OHX5HOu1mra/cczCWu+O5aSwBHoRAPsSRpQr4c75ADpVf0YqMzQ=="},{"number":17,"domain_urls":["https://node-17-com.utoken.io:8080"],"name":"node-17-com.utoken.io","direct_urls":["http://54.38.69.43:8080"],"key":"HggcAQABxAAB8MQtv/U7/bmO99+OpQwP71/k9A+tHX4IsK8NoeUAKQCo9YCo7eXpzjW0dglJZpeCJZ4Il+ddcY5uRrHV/wiWzE53f5xDpIhTZx2Qpeg29KKFon/Wvg76mltgjHiwJOrG2Ms5f/Ehcn9vH8xTUNi5s2cebTHBojV6DquflMRZRzwv5s3gbuir9R8eVm+CuYW7zr5s/rUgMKPqIq3KlsGEt7o2KXMbvpilwadnig/+1Ch87IFER+oc8JTDtPXfp43IbLGlYx5Og+oSXI9ahuC9cbDuvb4VCEZKynnS24A+wtRgQnC2IWlZ2Es/yBrpaSYMbPbfZ5dLXOOoDcwCqOX0ew=="},{"number":18,"domain_urls":["https://node-18-com.utoken.io:8080"],"name":"node-18-com.utoken.io","direct_urls":["http://188.42.59.236:8080"],"key":"HggcAQABxAABuFCKX4pXZcSS33bAR/0fx5SHJX0lK5ufryhz5mqd3vTitvIvM8s+fT9f0NN33yzZEbsRIu8CAd+9dR78rtf0qF9RLdU7jUo80/mSeHlqXFAATCTKIAI8V4hLMaEgaIIiz1SjIZJxrJ2aIcrjgoiEc2xZFcPSvNgtsgKKAflyNvz+nQ0Muc2/PfBWBxV8qKDvRSwYqGKno9C+3r/cc9R8Lxgi6C9sAd/xjz5DvB8zXQ782w54rTuR1/vKMbSkuCIyvjtfJD8Xd0XRERWEie8PXqEebwlg/2RSmeebb6b4RVF6ebw8P7VZIHXbSi7TU7C6iK6stvBdq1ALXxpW3DhS5Q=="},{"number":19,"domain_urls":["https://node-19-com.utoken.io:8080"],"name":"node-19-com.utoken.io","direct_urls":["http://188.42.59.252:8080"],"key":"HggcAQABxAABxktXotxgHKRuyGpuhQYhfOWN4Yb+CTcSQ/TIR7edLT0GnIHOfpUNcWHSMsjWeQ8W3+O6f15iZ+tl4KCXPENu8886FA7SqRrfRv4eb/bamC16H1D3YGZ+doKXM7BBvv4PW/TEHML/z2zllHNNdixCWOm9YgS2vdB7CjH4BjF4yuRJ4uE0U/2PI+uvqdgrdOVfYYhVLwexeuYSepy5pwN/Yim4ABJdcYJZDvaWMjNfA9hJmw8xEf3p8/7ZtENH5X9CugHMyPGwubmypHZU1S/NLSnxkXuMsZ+us/OhhPQsNp1pSDnCOKM6lnn37L4u9iGxgkPkd138omdVjVA7rcBb7w=="},{"number":20,"domain_urls":["https://node-20-com.utoken.io:8080"],"name":"node-20-com.utoken.io","direct_urls":["http://188.42.60.76:8080"],"key":"HggcAQABxAABvi6jaBGQOizEkZeZo0fwpdajodRCdu2+nbZZSN2fIPnAMXXRMbDHOsSXpkGq1p2Is9xXenrNbQtUEQ3DfL3/OBMe/pdx+FPfkQaOqweZyvO7H4VTbeDECTlFBvRzEb4LlS1P3Ly6qX3c0kIiaATzzY+vUshq/GW5Ufz4L0hPeSX+nQQXuiUBwTyygcADvaL3Q2o44yi/VjSKhSDg6VfHj39vpSRoeBFKNFfT+gwfeL0zAed4ltcaKqhBeEjRo9n7QDr6RhPphdIewKlL79IMHiv2pk2IaW9qBOokDpSutQN8SlL85P/uK2QoVWQ4NooNDPm6V/ejeP9ZZlZghjhS+Q=="},{"number":21,"domain_urls":["https://node-21-com.utoken.io:8080"],"name":"node-21-com.utoken.io","direct_urls":["http://188.42.60.68:8080"],"key":"HggcAQABxAAB2MkFonqp5zR3iNfrrMXS6cpkNpyqJ9Ule6LeSGM6qUmSyuneJOZ8mU82EhAWbqW2N7MuV5lPilM50lCj9Z+8Nh368SKkSH/1DbvLUkzQvCg24fYvq+WFPGrnTjtNheZvpQVcwZwVlk/sB3yySFzLzAxvK4RrRuuVOIJKRHO5OYPMXKc6nDgce6av4anPj+BX0C9j172Loi0Nw0rljJYrbN0qftp4/EuNcMhHpQ7LljyWA8py1ElHanyVLPDzXvzCshvjYWitJoYJpwoaMSPmcQPYNMcZWwwe4x35U1TKK84rSt/lJKkY943cYQ8+vQwQ/4PpVSPBEVIAlaJISKes7w=="},{"number":22,"domain_urls":["https://node-22-com.utoken.io:8080"],"name":"node-22-com.utoken.io","direct_urls":["http://188.42.60.108:8080"],"key":"HggcAQABxAABp5sRo1Z3FI7tr9h6pM4skrErfsq2DIt/PIVYtlRMcyj50VKmeMJIFlOwKwWSdTXYrv4risdNFNOusTLSbsJNAG03W5VvvQZ52xxYLgucvu00jCMvicZtV4NSNXVLVzA7+0ihGT7aj0vcO2JGlpjmj334ZcUCI68TqIDDycnuEgQ5ZPvNEasnht37zLHnvypLvxMHSfS/UOaZJ1hWSVdAcOpx/o9EeTF31RLNPieRx5p3xXL6IfhWUnq/aeIS6ARiGeH2vbwZ/m2l623j/P8bDRgCVlSvWhTy//uB4A/lr6SrLp/k7INLEeavnfTsfLP8fU+SiUNZnmOqi/vWcLnQxw=="},{"number":23,"domain_urls":["https://node-23-com.utoken.io:8080"],"name":"node-23-com.utoken.io","direct_urls":["http://188.42.60.252:8080"],"key":"HggcAQABxAABsJNUHF5VsO3AIuxBKaJcIKyEnq+NEE+0yUlKnyRzZUxnAm/Su/IaeN5ATCnJ+MHuf0xO4e+V4ePaF4NvQ3kticWQ++wJvHDP81NS1A+lFKs7+jkDBkIDfeMlGQcgLrNdi6S14WJzNIfjEzFxPhEX7X1t+6AYaUxV53LeyNiaSBeAR+C8LQ/ycp4vNv7b4hG9yTwsdmLxecE27XxqiV/8U+byNEzxMJBOYtajcj0fRtubvRopKpJA4aKuWxkxMSvjqsu8pDuEl+ksSgJc6NvpHqNUoNppFVjSPuYvkbOX4zOwajNeWbM1Z56Rpizzu8NFm/tH18FZtf99rhUhTmKdMQ=="},{"number":24,"domain_urls":["https://node-24-com.utoken.io:8080"],"name":"node-24-com.utoken.io","direct_urls":["http://188.42.198.132:8080"],"key":"HggcAQABxAABsW3eWt5ME6zLIcBi6tns/J+5qQvffC+Pb8RNSHxapOTwcmfiMapAwbxRgr2MBYzg7ailsiJF6no7SbqU8cnK2BYkGlHKJaHPRwrgtCwmEiXhlBc+0Z2Z6gMFqSr6fSkeN5e2cmm8D/mxTY3fb3Zum3w8QzGsu9TAUfPf/di9dKrZ8riFN3O0Tjvou0YSE32h2gSUd9Sdd5u1kLrETihMZmG7nio/6uYQI2SAQ+koiKhlTAfAxDuJXyRV4jQKFKF/3xnspIg44OZ4eaK/u4mTfdzIjE/pGjUt5otfaozqLgY/cC2Iqbd8hzIjL8NJdQbbdcj1vGEsgUF8aYPd3KMuvQ=="},{"number":25,"domain_urls":["https://node-25-com.utoken.io:8080"],"name":"node-25-com.utoken.io","direct_urls":["http://188.42.60.84:8080"],"key":"HggcAQABxAABqNMe593lGfjhFW07nj6wsUiLLu0P8UFVXOLN4Yth6n+mO/WC3AqoW1aiHJu6xpgKwnMa76wcWf9o+dUYTUFUbORDY+qPFJ5iGQJqHfl5BKzFc2QxBHLfPyK7C7QGrjzv1wlDJRfb3a4BRbFZcZNccQSOJKtc5fUeiY5dPkSkln/Qqkj3FUKumYKe3JOIVJNc3DkwthsUeiATYgO+8u+khRWmZ1uAmUxqpZ39IHVoUlik4P0jPw66pBjwwl9/9sdCkHSmyyi3KkpzgOXi09Ud/Xh79T1Q6eUPCMTaE3zhoK85F4ZNHkosWwGSOvEaEn8ZTXOMw9SfXog6oNXPbdr6Lw=="},{"number":26,"domain_urls":["https://node-26-com.utoken.io:8080"],"name":"node-26-com.utoken.io","direct_urls":["http://188.42.60.52:8080"],"key":"HggcAQABxAABsEe+J2IutbYGVlTJNkXLD7pn8b+SVWggYJgNkQ4EfDnSqzEJQX7z3mNHF50/yX6WtlXkrjAvHa4am2yP03/V0Gjuvurk/rFnn6RavqQmT2PLfMpcSTZx12Xa+5RKxVHkuAwVb8evnwphnWbtFL051qDq8ZNVDwjA3mqoa2BBGmvN2Ulw4G6CII7GlsKhxqLe0INFbOTj4F5FQhNrLCb56nMgTHSMuh3gSFh1J89H32L8D/73+5brcLq5Fo2vWmMN8bs3Eq/0R0bE0j5AlTpZ+aDvME/xVZfIeJB1JjoM8BggzJI5xoUCFd1dWmb6cp1KeiA3nY0h3VqFaFxOYw6fuQ=="},{"number":27,"domain_urls":["https://node-27-com.utoken.io:8080"],"name":"node-27-com.utoken.io","direct_urls":["http://188.42.198.204:8080"],"key":"HggcAQABxAAB0OoFNJBpNb6TN9kPQ4cKaxZcrd32z60pyffRtMwMAw/8h+vwFuCfhPu44ksPpvTNpseRdLA+1tnBh9JAzY1AY4xVQdy/eelEnar+lXz0RKOSiPW5y5GO3REfe5cS2My7se3nykf7pq96Ob1BwoDdOhLmDasoVGx/X670Lus9aLK+aq+Lg1n2bEgQh/ZPkNYhm7Vms2bMBltjVa8XJyATLQitduUczKJliYK7u2LuJAZFp64hd80VU1+tYGwNKZDb7TKo1oBcSBBzslKUJHeO+yS9itB6yr1TryHeviItyDcsUZO4biyTxYwsRDGltDsAecJ40LAPzyrF8qfkDeysrQ=="},{"number":28,"domain_urls":["https://node-28-com.utoken.io:8080"],"name":"node-28-com.utoken.io","direct_urls":["http://188.42.190.180:8080"],"key":"HggcAQABxAABsRWLrzSEhKGC8bSQvLn70tWddaU5uZNrk4nGoQwLcKWbaiObLN+XN5Gsd2gXImjVi9JPh67WkHBX4rDQkkHzbsdbo+G7Bl011tP42JEG20cb72UH+K24QPAoAodSRZtYcXlTKYrywPOdqVRWj3r3tqjBhFiSiKKmpa8uoxX5uQS+RK2bZPrLjVxIMEFNjrsOZRaw+ZL9Jr5B3yOHm61rn2sYliTsmKnQapdJSaKC3lc448TrATQ9SjXvQLHOVAFTUgVBgmY43HdcPkmautm9D1KtUf6J0SL+C3cn1hpikbsKSPvX72OfjQ7IeSIgKU7a1Et5jSkm80MQVuwKAINr7Q=="},{"number":29,"domain_urls":["https://node-29-com.utoken.io:8080"],"name":"node-29-com.utoken.io","direct_urls":["http://188.42.190.108:8080"],"key":"HggcAQABxAAB03SkEnI8XqvTtoHNKJbPvnbfncMJtcDUQns2Vm+O1Sz3NvZtfLcoktJr9dp9iTqCOKMDezmks3tkDvAdPS3b8YRtRhsHWq9V/aBqQ7QG/22124M/Q9yneThYMjNhRjkycIixyiQe7xGt/Yg66a8ioL+QinBqdJzcNczlrmBjLBZklnh4pRBwmuvxNG2KaIaD2Zf8Xq9pN18Fj3JDrPkySobHu35wuzMlsI9gWif82Ge+jKEtbUPzb/+9r62+wrqp6jxsP9nv98Y36baqgDgz35nhz4rVpfYo8cRc0fdYUQSe8nKzivDr/yksmkhRkYdHQg91YB9XxDob+/TFgMQr3Q=="},{"number":30,"domain_urls":["https://node-30-com.utoken.io:8080"],"name":"node-30-com.utoken.io","direct_urls":["http://188.42.33.100:8080"],"key":"HggcAQABxAAB4wKmZDObvod6KZN6zS6DiCTTVqKsR//GvIyFoxJbeE8Q3lINAXX94Mag/GR0/RwOBzUYKmm57RCfujtoG7iC9+cxp9DZ0eG8cJv118J0tin0vYwI7KmtSc45bSv9tEsKJl9adXFO0mVHeOffy0OUxNDzG6ibxSvl+sYALthL4nUuPnEEDbiEgcdk7Jsn/angbxG8QmYIfku9Ihq5rP/yLuyBfPyoqZ5f0QLSZG25Oea0Lnz+fWCjPvoFTQmuqvOB1yPDq75646SslN19tRs+k1YrxcZ699Vh8o+skp1noRgWkeT//gmUVU9yYjNtfLNW0WKVIczJPUWisvd916rZtQ=="},{"number":34,"domain_urls":["https://node-34.dna01.ru:8080"],"name":"node-34.dna01.ru","direct_urls":["http://46.18.201.176:8080"],"key":"HggcAQABxAABsbh2uUdHo36BPpcNBAd/0kpJV+L0P739tFFaFD4hPba6myud98l5eU24B2/lzToeWvmRaeCPqamo6sItbBJ6XPo8RFIQNuHsjeJbxfg96IjKgECAinL/Q+zmUvSR41UvhvMCDGZ1TOtr4ayFAQBI/ka6ScR7nAPO71zy5BlaredRNMlXdjgNjXUKgALyk/ebUwlYu0yAC1Cvg3GS2teYXCWKZMF0uRiK2DqKplKaIqeCKLaxRDOEbrdY2E813Wst7onZbSPxxD9lSB3FcqY93LdjOs/1pXASQOEUGp60bS5y+Foo2y2UwTqDvUEuxtPLXVi+Dh4/JUpeSOHzqjIZeQ=="},{"number":35,"domain_urls":["https://node-35-com.utoken.io:8080"],"name":"node-35-com.utoken.io","direct_urls":["http://188.42.59.132:8080"],"key":"HggcAQABxAAB/lJfvA9v71yEbPn4nPMbYBmaZR3HtVG/WFgADa6zl/H1zqxZeTEfrwunX2jVOSTc6+c/P0zITK+cG5kaSz4ySMfaXqVTGuQGvjUrK8wCLvGNcEfiA981uf0qEJ+VioQiUnoxi8SedTRflD765bQAvssHCAl9DyUEp0dPiEYBtcr6yocGZfrohro9nT2ycqBFHQLKWtKUCmGz7fR1ZvC+HrrbImQmpo7R1pX0qiR5ojiEtDBnql5aDwGNUjJ5heNKcqJ/V8XP/AhsCPp87w5fHTokYQiohMfun5vEi1GOgabV8dRG793m3eQIcZmwd7s7Becz93SwlPU2P5fI1Zso+Q=="},{"number":36,"domain_urls":["https://node-36-com.utoken.io:8080"],"name":"node-36-com.utoken.io","direct_urls":["http://188.42.190.84:8080"],"key":"HggcAQABxAAB2QbBrTPO72iSkzsCfYiHi21UmQL85qTrOL/P145JAvLsNkXVE5vYyiinwiQz3IhMvUz35nQ44q5XvQvwNMKWCqMkToRVzGvE2vVgH6joUiYTgKJkxOz+d3FQFOxNEB3DFK2WRr/6Nl/v4xrB3daqG38C72NbORhZ63f2iS7ZYC2d23ZbiJBv82SnV/NBs3Aa5qWkfgqlmt3Z0a6d0zpGJW7L+qYo3ueH2dsme0bET1zm6rX/QpJTLYl8avkDyfSHZJp/8SIgS2DQ7OFl/rSKAmT9W79U6G1GURXCYLvzL+6W1wfjrK+m7Va21xZDMxm/z5/ONG+YmLVeAznw4bLe7Q=="}],"updated":1575359979}');

let privateKey: PrivateKey;

declare var module: any;
declare var process: any;

const isNode = typeof module !== "undefined" && module.exports;

// const isNode = typeof window === 'undefined';

if (isNode)
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

describe('Network', function() {

  before(async () => {
    privateKey = await PrivateKey.unpack({ bin: keyBin, password: keyPassword });
  });

  describe("Connection", function() {
    it('should connect to network with default topology', async () => {
      let response;
      const network = new Network(privateKey);

      try { await network.connect(); }
      catch (err) { console.log("network connection error: ", err); }

      try { response = await network.command("sping"); }
      catch (err) { console.log("network command error:", err); }

      response.sping.should.equal("spong");
    });

    if (isNode) {
      it('should connect to network with provided topology file', async function() {
        this.timeout(8000);
        const net = new Network(privateKey, {
          topologyFile: "/Users/anzhu/Documents/mainnet.json"
        });

        try { await net.connect(); }
        catch (err) { console.log("network connection error: ", err); }

        let response;

        try { response = await net.command("sping"); }
        catch (err) { console.log("on network command:", err); }

        response.sping.should.equal("spong");
      });
    }

    it('should connect to network with provided topology', async function() {
      this.timeout(8000);

      const packed = packedTopology;
      const topology = await Topology.load(packed);

      const net = new Network(privateKey, { topology });

      try { await net.connect(); }
      catch (err) { console.log("network connection error: ", err); }

      let response;

      try { response = await net.command("sping"); }
      catch (err) { console.log("on network command:", err); }

      response.sping.should.equal("spong");
    });
  });

  describe("Topology", function() {
    it('should pack topology', async () => {
      const packed = packedTopology;
      const topology = await Topology.load(packed);
      const repacked = topology.pack();

      packed.updated.should.equal(repacked.updated);
      packed.list.length.should.equal(repacked.list.length);
    });
  });

  describe("Commands", function () {
    let network: Network;

    beforeEach(async function() {
      network = new Network(privateKey);

      try { await network.connect(); }
      catch (err) { console.log("network connection error: ", err); }
    });

    it('should do simple contract status check (id base64)', async function() {
      this.timeout(5000);
      let response;

      try { response = await network.checkContract(approvedId, 0.7); }
      catch (err) { console.log("on network command:", err); }

      response.itemResult.state.should.equal("APPROVED");
    });

    it('should do simple contract status check (id bytes)', async function() {
      this.timeout(5000);
      let response;

      try { response = await network.checkContract(approvedId, 0.7); }
      catch (err) { console.log("on network command:", err); }

      response.itemResult.state.should.equal("APPROVED");
    });

    it('should perform command with parameters', async function() {
      this.timeout(5000);
      let response;

      try {
        response = await network.command("getState", {
          itemId: { __type: "HashId", composite3: approvedId }
        });
      }
      catch (err) { console.log("on network command:", err); }

      response.itemResult.state.should.equal("APPROVED");
    });

    it('should do full status check', async function() {
      this.timeout(60000);
      let isApproved: boolean = false;

      try { isApproved = await network.isApproved(approvedId, 0.6); }
      catch (err) { console.log("on network command:", err); }

      isApproved.should.equal(true);
    });

    it('should do full status check (force http)', async function() {
      this.timeout(60000);
      network = new Network(privateKey, { directConnection: true });

      await network.connect();
      let isApproved: boolean = false;

      try { isApproved = await network.isApproved(approvedId, 0.6); }
      catch (err) { console.log("on network command:", err); }

      isApproved.should.equal(true);
    });

    it('should do full status check (extended response)', async function() {
      this.timeout(60000);
      let status;

      try { status = await network.isApprovedExtended(approvedId, 0.6); }
      catch (err) { console.log("on network command:", err); }

      status.isApproved.should.equal(true);
    });

    it('should do full status check (extended response with callback)', async function() {
      this.timeout(60000);
      let status;

      function onResponse(resp) {
        // console.log(resp);
      }

      try { status = await network.isApprovedExtended(approvedId, 0.6, onResponse); }
      catch (err) { console.log("on network command:", err); }

      status.isApproved.should.equal(true);
    });

    it('should not freeze if responses are not enough to find consensus', async function() {
      this.timeout(60000);
      let status;

      const freezeID = decode64("0RS81rF8Ohu8IBjo6v+l15G3WqaW62EcLKM9iAVzjRyHfrL3PsrfKEJJnmVinrNHyAZQtY6UpEnj2kqAoc3vByJWqdFMC8t+Bk3rgUdTIzscr4o8rkG/cUSPQVtTS7Gz");

      function onResponse(resp) {
      }

      try { status = await network.isApprovedExtended(freezeID, 0.6, onResponse); }
      catch (err) {
        console.log("on network command:", err);
      }

      status.isApproved.should.equal(false);
    });

    it('should load network time offset', async function() {
      this.timeout(60000);

      try { await network.loadNetworkTime(); }
      catch (err) { console.log("on network command:", err); }

      if (!network.timeOffset) return should.fail("timeOffset is null");

      network.timeOffset.should.be.a('number');

      const now = network.now();

      now.should.be.instanceof(Date);
    });
  });
});
