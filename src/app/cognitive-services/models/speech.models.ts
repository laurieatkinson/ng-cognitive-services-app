export interface ISpeakerIdentity {
    status: string;
    createdDateTime: Date;
    lastActionDateTime: Date;
    processingResult: {
        identifiedProfileId: string;
        confidence: string;
    };
}

export interface IVoiceOptions {
    [name: string]: {
        display: string,
        greeting?: string,
        voices?: {
            locale: string,
            gender: string,
            fullName: string,
            name: string
        }[]
    };
}

export let VoiceOptions: IVoiceOptions = {
    'en-US': {
        'display': 'English - US',
        'greeting': 'Welcome to Text-To-Speech Online Demo.',
        'voices': [
            {
                'locale': 'en-US',
                'gender': 'Female',
                'fullName': 'Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)',
                'name': 'Zira'
            },
            {
                'locale': 'en-US',
                'gender': 'Male',
                'fullName': 'Microsoft Server Speech Text to Speech Voice (en-US, BenjaminRUS)',
                'name': 'Benjamin'
            }
        ]
    },
    'en-IN': {
        'display': 'English - IN',
        'greeting': 'Welcome to Text-To-Speech Online Demo.',
        'voices': [
            {
                'locale': 'en-IN',
                'gender': 'Male',
                'fullName': 'Microsoft Server Speech Text to Speech Voice (en-IN, Ravi, Apollo)',
                'name': 'Ravi'
            }
        ]
    },
    'en-GB': {
        'display': 'English - GB',
        'greeting': 'Welcome to Text-To-Speech Online Demo.',
        'voices': [
            {
                'locale': 'en-GB',
                'gender': 'Female',
                'fullName': 'Microsoft Server Speech Text to Speech Voice (en-GB, Susan, Apollo)',
                'name': 'Susan'
            },
            {
                'locale': 'en-GB',
                'gender': 'Male',
                'fullName': 'Microsoft Server Speech Text to Speech Voice (en-GB, George, Apollo)',
                'name': 'George'
            }
        ]
    }
};
