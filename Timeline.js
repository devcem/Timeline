var Timeline = pc.createScript('timeline');

Timeline.attributes.add('autoplay', { type : 'boolean' });

Timeline.attributes.add('loop', { type : 'boolean', default : false });
Timeline.attributes.add('yoyo', { type : 'boolean', default : false });
Timeline.attributes.add('position', { type : 'boolean', default : false });
Timeline.attributes.add('scale', { type : 'boolean', default : false });
Timeline.attributes.add('rotation', { type : 'boolean', default : false });
Timeline.attributes.add('opacity', { type : 'boolean', default : false });
Timeline.attributes.add('custom', { type : 'boolean', default : false });
Timeline.attributes.add('playSound', { type : 'boolean', default : false });
Timeline.attributes.add('duration', { type : 'number', default : 1 });
Timeline.attributes.add('delay', { type : 'number', default : 0 });
Timeline.attributes.add('repeat', { type : 'number', default : 0 });
Timeline.attributes.add('soundDelay', { type : 'number', default : 0 });
Timeline.attributes.add('rollback', { type : 'number', default : 0 });
Timeline.attributes.add('ease', {
    type : 'string',
    enum : [
        { Linear : 'Linear' },
        { QuadraticIn : 'QuadraticIn' },
        { QuadraticOut : 'QuadraticOut' },
        { QuadraticInOut : 'QuadraticInOut' },
        { CubicIn : 'CubicIn' },
        { CubicOut : 'CubicOut' },
        { CubicInOut : 'CubicInOut' },
        { QuarticIn : 'QuarticIn' },
        { QuarticOut : 'QuarticOut' },
        { QuarticInOut : 'QuarticInOut' },
        { QuinticIn : 'QuinticIn' },
        { QuinticOut : 'QuinticOut' },
        { QuinticInOut : 'QuinticInOut' },
        { SineIn : 'SineIn' },
        { SineOut : 'SineOut' },
        { SineInOut : 'SineInOut' },
        { ExponentialIn : 'ExponentialIn' },
        { ExponentialOut : 'ExponentialOut' },
        { ExponentialInOut : 'ExponentialInOut' },
        { CircularIn : 'CircularIn' },
        { CircularOut : 'CircularOut' },
        { CircularInOut : 'CircularInOut' },
        { BackIn : 'BackIn' },
        { BackOut : 'BackOut' },
        { BackInOut : 'BackInOut' },
        { BounceIn : 'BounceIn' },
        { BounceOut : 'BounceOut' },
        { BounceInOut : 'BounceInOut' },
        { ElasticIn : 'ElasticIn' },
        { ElasticOut : 'ElasticOut' },
        { ElasticInOut : 'ElasticInOut' }
    ],
    default : 'Linear'
});

Timeline.attributes.add('startFrame', {
    type: 'json',
    schema: [{
        name: 'position',
        type: 'vec3',
    }, {
        name: 'rotation',
        type: 'vec3'
    }, {
        name: 'scale',
        type: 'vec3',
        default : [1, 1, 1]
    },{
        name  : 'opacity',
        type  : 'number',
        default : 1
    },{
        name  : 'custom',
        type  : 'string',
        description : 'For example camera.fov = 40'
    }]
});

Timeline.attributes.add('endFrame', {
    type: 'json',
    schema: [{
        name: 'position',
        type: 'vec3',
    }, {
        name: 'rotation',
        type: 'vec3'
    }, {
        name: 'scale',
        type: 'vec3',
        default : [1, 1, 1]
    },{
        name  : 'opacity',
        type  : 'number',
        default : 1
    },{
        name  : 'custom',
        type  : 'string',
        description : 'For example camera.fov = 40'
    }]
});

Timeline.prototype.initialize = function() {
    this.animation = {
        custom : 0  
    };
    
    this.eventListener = false;
    
    this.app.on('Timeline:' + this.entity.name, this.onPlay, this);
    this.app.on('Timeline:' + this.entity.name + '@Time', this.setTime, this);
    this.entity.on('Timeline', this.onPlay, this);
    
    this.on('destroy', this.onDestroy, this);
    this.on('state', this.onStateChange, this);
    
    if(this.autoplay){
        this.onPlay();
    }
};

Timeline.prototype.setTime = function(time) {
    this.duration = time;
};

Timeline.prototype.onStateChange = function(state) {
    if(state === true){
        if(this.autoplay){
            this.onPlay();
        }
    }else{
        this.reset();
    }
};

Timeline.prototype.onDestroy = function() {
    
};

Timeline.prototype.getEase = function() {
    return pc[this.ease];
};

Timeline.prototype.reset = function() {
    if(this.positionFrames){
        this.positionFrames.stop();    
    }
    
    if(this.rotationFrames){
        this.rotationFrames.stop();    
    }
    
    if(this.scaleFrames){
        this.scaleFrames.stop();    
    }
    
    if(this.opacityFrames){
        this.opacityFrames.stop();    
    }
    
    if(this.customFrames){
        this.customFrames.stop();    
    }
};

Timeline.prototype.setFirstFrame = function(options) {
    var frame = this.startFrame;
    
    if(options.isReverse){
        frame = this.endFrame;
    }
    
    if(this.position){
        this.entity.setLocalPosition(frame.position);
    }
    
    if(this.rotation){
        this.entity.setLocalEulerAngles(frame.rotation);
    }
    
    if(this.scale){
        this.entity.setLocalScale(frame.scale);
    }
    
    if(this.opacity){
        this.entity.element.opacity = frame.opacity;
    }
    
    if(this.custom){
        var parts = frame.custom.split(' = ');
        var query = parts[0];
        var value = parseFloat(parts[1]);
        
        this.animation.custom = value;
        eval('this.entity.' + this.custom);
    }
};

Timeline.prototype.onComplete = function(){
    //event?
};

Timeline.prototype.onPlay = function(_options) {
    var self = this;
    var options = {
        isReverse : false,
        delay     : this.delay,
        playSound : this.playSound
    };
    
    if(typeof _options == 'object'){
        options.isReverse = _options.isReverse ? true : false;
    }
    
    if(typeof _options == 'object'){
        options.playSound = _options.playSound ? true : false;
    }

    if(options.playSound){
        setTimeout(function(self){
            self.entity.sound.play('Sound');
        }, 1000 * this.soundDelay, this);
    }
    
    var frame = this.endFrame;
    
    if(options.isReverse){
        options.delay = 0;
        frame = this.startFrame;
    }
    
    this.reset();
    this.setFirstFrame(options);
    
    if(this.position){
        this.positionFrames = this.entity.tween(
            this.entity.getLocalPosition()
        ).to({
            x : frame.position.x,
            y : frame.position.y,
            z : frame.position.z
        }, this.duration, this.getEase()).delay(options.delay);
        
        if(!this.eventListener){
            this.eventListener = this.positionFrames.on('complete', this.onComplete, this);
        }
        
        if(this.loop){
            this.positionFrames.loop(true);
        }
        
        if(this.yoyo){
            this.positionFrames.yoyo(true);
        }
        
        if(this.repeat > 0){
            this.positionFrames.repeat(this.repeat);
        }
        
        /*
        if(options.isReverse){
            this.positionFrames.reverse();
        }
        */
        
        this.positionFrames.start();
    }
    
    if(this.rotation){
        this.rotationFrames = this.entity.tween(
            this.entity.getLocalEulerAngles()
        ).rotate({
            x : frame.rotation.x,
            y : frame.rotation.y,
            z : frame.rotation.z
        }, this.duration, this.getEase()).delay(options.delay);
        
        if(!this.eventListener){
            this.eventListener = this.rotationFrames.on('complete', this.onComplete, this);
        }
        
        if(this.loop){
            this.rotationFrames.loop(true);
        }
        
        if(this.yoyo){
            this.rotationFrames.yoyo(true);
        }
        
        if(this.repeat > 0){
            this.rotationFrames.repeat(this.repeat);
        }
        
        /*
        if(options.isReverse){
            this.rotationFrames.reverse();
        }
        */
        
        this.rotationFrames.start();
    }
    
    if(this.scale){
        this.scaleFrames = this.entity.tween(
            this.entity.getLocalScale()
        ).to({
            x : frame.scale.x,
            y : frame.scale.y,
            z : frame.scale.z
        }, this.duration, this.getEase()).delay(options.delay);
        
        if(!this.eventListener){
            this.eventListener = this.scaleFrames.on('complete', this.onComplete, this);
        }
        
        if(this.loop){
            this.scaleFrames.loop(true);
        }
        
        if(this.yoyo){
            this.scaleFrames.yoyo(true);
        }
        
        if(this.repeat > 0){
            this.scaleFrames.repeat(this.repeat);
        }
        
        /*
        if(options.isReverse){
            this.scaleFrames.reverse();
        }
        */
        
        this.scaleFrames.start();
    }
    
    if(this.opacity){
        this.opacityFrames = this.entity.tween(
            this.entity.element
        ).to({
            opacity : frame.opacity
        }, this.duration, this.getEase()).delay(options.delay);
        
        if(!this.eventListener){
            this.eventListener = this.opacityFrames.on('complete', this.onComplete, this);
        }
        
        if(this.loop){
            this.opacityFrames.loop(true);
        }
        
        if(this.yoyo){
            this.opacityFrames.yoyo(true);
        }
        
        if(this.repeat > 0){
            this.opacityFrames.repeat(this.repeat);
        }
        
        /*
        if(options.isReverse){
            this.opacityFrames.reverse();
        }
        */
        
        this.opacityFrames.start();
    }
    
    if(this.custom){
        var parts = frame.custom.split(' = ');
        var query = parts[0];
        var value = parseFloat(parts[1]);
        
        this.customFrames = this.entity.tween(
            this.animation
        ).to({
            custom : value
        }, this.duration, this.getEase()).delay(options.delay);
        
        this.customFrames.on('update', function(){
            eval('this.entity.' + query + ' = ' + self.animation.custom);
        });
        
        /*
        if(options.isReverse){
            this.customFrames.reverse();
        }
        */
        
        this.customFrames.start();
    }
    
    if(this.rollback > 0 && !options.isReverse){
        setTimeout(function(self){
            self.onPlay({
                isReverse : true
            });
        }, this.rollback * 1000, this);
    }
};
